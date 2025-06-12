import RazorpayCheckout from 'react-native-razorpay';

export const openRazorpayCheckout = async ({
  amount,
  user,
  booking,
}: {
  amount: number;
  user: { name: string; email: string; contact: string };
  booking: { venueName: string; courtName: string; date: string; slots: number };
}) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: 'rzp_live_qyWsOEPEllNahd',
      amount: amount * 100, // in paise
      currency: 'INR',
      name: 'BookVenue',
      description: `Booking for ${booking.venueName} - ${booking.courtName}`,
      image: 'https://images.pexels.com/photos/3775042/pexels-photo-3775042.jpeg',
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      notes: {
        venue_name: booking.venueName,
        court_name: booking.courtName,
        booking_date: booking.date,
        total_slots: booking.slots,
      },
      theme: {
        color: '#2563EB',
      },
    };

    RazorpayCheckout.open(options)
      .then((data: any) => {
        resolve(data); // { razorpay_payment_id, ... }
      })
      .catch((error: any) => {
        if (error.code === 'Cancelled') {
          reject(new Error('Payment cancelled by user'));
        } else {
          reject(error);
        }
      });
  });
};
