import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { venueApi } from '@/api/venueApi';
import { bookingApi } from '@/api/bookingApi';
import { Venue } from '@/types/venue';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, CreditCard, CheckCircle2 } from 'lucide-react-native';
import { useStripe } from '@stripe/stripe-react-native';

export default function BookingConfirmScreen() {
  const { venueId, date, startTime, endTime, price } = useLocalSearchParams<{
    venueId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: string;
  }>();
  
  const router = useRouter();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        if (!venueId) return;
        const response = await venueApi.getVenueById(venueId);
        setVenue(response);
      } catch (error) {
        console.error('Error fetching venue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const calculateTotalAmount = () => {
    if (!price) return 0;
    
    const priceValue = parseFloat(price);
    const startHour = parseInt(startTime?.split(':')[0] || '0');
    const endHour = parseInt(endTime?.split(':')[0] || '0');
    const hours = endHour - startHour;
    
    return priceValue * hours;
  };
  
  const totalAmount = calculateTotalAmount();
  
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setError(null);
      
      // In a real app, this would initiate a payment flow with Stripe
      // For demo purposes, we'll simulate a successful payment
      
      // Initialize the Payment Sheet
      // const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
      
      // const { error: initError } = await initPaymentSheet({
      //   merchantDisplayName: 'BookVenue',
      //   customerId: customer,
      //   customerEphemeralKeySecret: ephemeralKey,
      //   paymentIntentClientSecret: paymentIntent,
      //   allowsDelayedPaymentMethods: false,
      // });
      
      // if (initError) {
      //   setError(initError.message);
      //   return;
      // }
      
      // Present the Payment Sheet
      // const { error: presentError } = await presentPaymentSheet();
      
      // if (presentError) {
      //   setError(presentError.message);
      //   return;
      // }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create booking
      const bookingData = {
        venueId,
        date,
        startTime,
        endTime,
        totalAmount,
        userId: user?.id || '',
        status: 'confirmed'
      };
      
      await bookingApi.createBooking(bookingData);
      setBookingConfirmed(true);
      
      // Navigate to bookings screen after 2 seconds
      setTimeout(() => {
        router.replace('/bookings');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!venue) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Venue not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (bookingConfirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle2 size={64} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successText}>
            Your booking has been successfully confirmed. You can view your booking details in the Bookings tab.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bookingDetailsContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.venueInfoContainer}>
            <Image 
              source={{ uri: venue.images[0] }} 
              style={styles.venueImage}
            />
            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>{venue.location}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={20} color="#2563EB" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(date || '')}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={20} color="#2563EB" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{startTime} - {endTime}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <DollarSign size={20} color="#2563EB" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Price per hour</Text>
                <Text style={styles.detailValue}>${price}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.paymentSummaryContainer}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Venue charges</Text>
            <Text style={styles.summaryItemValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Service fee</Text>
            <Text style={styles.summaryItemValue}>$0.00</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity style={styles.paymentMethodItem}>
            <CreditCard size={20} color="#2563EB" />
            <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
          </TouchableOpacity>
        </View>
        
        {error && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>Pay ${totalAmount.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 16,
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButtonContainer: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  bookingDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  venueInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  venueInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  venueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  paymentSummaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItemLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
  },
  summaryItemValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  paymentMethodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  paymentMethodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  errorMessageContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});