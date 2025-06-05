import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { venueApi } from '@/api/venueApi';
import { Venue } from '@/types/venue';
import { ArrowLeft, Star, MapPin, Clock, DollarSign, Calendar, ArrowRight, ChevronRight } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  const today = new Date();
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: date.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        if (!id) return;
        const response = await venueApi.getVenueBySlug(id);
        setVenue(response);
        setSelectedDate(nextDays[0].fullDate);
      } catch (error) {
        console.error('Error fetching venue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);
  
  // useEffect(() => {
  //   if (selectedDate && venue) {
  //     // Generate time slots between opening and closing time
  //     // In a real app, this would check against existing bookings from the backend
  //     const openingHour = parseInt(venue.openingTime.split(':')[0]);
  //     const closingHour = parseInt(venue.closingTime.split(':')[0]);
      
  //     const slots = [];
  //     for (let hour = openingHour; hour < closingHour; hour++) {
  //       slots.push(`${hour.toString().padStart(2, '0')}:00`);
  //     }
      
  //     setAvailableTimeSlots(slots);
  //     setSelectedTimeSlot('');
  //   }
  // }, [selectedDate, venue]);

  // const handleBooking = () => {
  //   if (!selectedTimeSlot) {
  //     // Show error - time slot not selected
  //     return;
  //   }
    
  //   const endTime = `${(parseInt(selectedTimeSlot.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
    
  //   router.push({
  //     pathname: '/booking/confirm',
  //     params: {
  //       venueId: venue?.id,
  //       date: selectedDate,
  //       startTime: selectedTimeSlot,
  //       endTime: endTime,
  //       price: venue?.pricePerHour
  //     }
  //   });
  // };
  useEffect(() => {
  if (selectedDate && venue) {
    const openingHour = parseInt(venue.openingTime.split(':')[0]);
    const closingHour = parseInt(venue.closingTime.split(':')[0]);

    const slots = [];
    for (let hour = openingHour; hour < closingHour; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(`${start} - ${end}`);
    }

    setAvailableTimeSlots(slots);
    setSelectedTimeSlot('');
  }
}, [selectedDate, venue]);

const handleBooking = () => {
  if (!selectedTimeSlot) return;

  const [startTime, endTime] = selectedTimeSlot.split(' - ');

  router.push({
    pathname: '/booking/confirm',
    params: {
      venueId: venue?.id,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      price: venue?.pricePerHour
    }
  });
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FlatList
            data={venue.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                style={[styles.venueImage, { width }]} 
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          
          <TouchableOpacity 
            style={styles.backButtonContainer}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.venueInfoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{venue.rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.locationText}>{venue.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={16} color="#2563EB" />
              <Text style={styles.infoText}>{venue.openingTime} - {venue.closingTime}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={{ fontSize: 16, color: "#2563EB" }}>₹</Text>
              <Text style={styles.infoText}>{venue.pricePerHour? 1400:1400}/hour</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{venue.description}</Text>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {venue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <View style={styles.amenityDot} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: venue.coordinates.latitude,
                longitude: venue.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: venue.coordinates.latitude,
                  longitude: venue.coordinates.longitude
                }}
                title={venue.name}
              />
            </MapView>
            
            <TouchableOpacity style={styles.viewOnMapButton}>
              <Text style={styles.viewOnMapText}>View on Map</Text>
              <ChevronRight size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.separator} />
          
          <Text style={styles.sectionTitle}>Booking</Text>
          
          <Text style={styles.dateSelectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {nextDays.map((day, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.dateItem,
                    selectedDate === day.fullDate && styles.selectedDateItem
                  ]}
                  onPress={() => setSelectedDate(day.fullDate)}
                >
                  <Text 
                    style={[
                      styles.dayText,
                      selectedDate === day.fullDate && styles.selectedDayText
                    ]}
                  >
                    {day.day}
                  </Text>
                  <Text 
                    style={[
                      styles.dateText,
                      selectedDate === day.fullDate && styles.selectedDateText
                    ]}
                  >
                    {day.date}
                  </Text>
                  <Text 
                    style={[
                      styles.monthText,
                      selectedDate === day.fullDate && styles.selectedMonthText
                    ]}
                  >
                    {day.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <Text style={styles.timeSelectionTitle}>Select Time Slot</Text>
          <View style={styles.timeSlotContainer}>
            {availableTimeSlots.map((slot, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text 
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot && styles.selectedTimeSlotText
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.bookingFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>₹{venue.pricePerHour? 1400:1400}</Text>
              <Text style={styles.priceUnit}>/hour</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.bookButton,
                !selectedTimeSlot && styles.bookButtonDisabled
              ]}
              onPress={handleBooking}
              disabled={!selectedTimeSlot}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
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
  imageContainer: {
    position: 'relative',
  },
  venueImage: {
    height: 250,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueInfoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#F59E0B',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  amenityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 8,
  },
  amenityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  viewOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  viewOnMapText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
    marginRight: 4,
  },
  dateSelectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateItem: {
    width: 64,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDateItem: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  monthText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  selectedMonthText: {
    color: '#FFFFFF',
  },
  timeSelectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
    marginBottom: 12,
  },
  selectedTimeSlot: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeSlotText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  priceUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});