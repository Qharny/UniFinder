import { Colors } from '@/constants/Colors';
import { COUNTRIES } from '@/constants/countries';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Country } from '@/types/university';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function CountrySelector({ selectedCountry, onSelectCountry, visible, onClose }: CountrySelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const handleCountrySelect = useCallback((country: string) => {
    onSelectCountry(country);
    onClose();
  }, [onSelectCountry, onClose]);

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        { backgroundColor: colors.background },
        selectedCountry === item.name && { backgroundColor: colors.tint + '20' }
      ]}
      onPress={() => handleCountrySelect(item.name)}
    >
      <Text style={[
        styles.countryName,
        { color: colors.text },
        selectedCountry === item.name && { color: colors.tint, fontWeight: '600' }
      ]}>
        {item.name}
      </Text>
      {selectedCountry === item.name && (
        <Ionicons name="checkmark" size={20} color={colors.tint} />
      )}
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.text }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Select Country</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={COUNTRIES}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryName: {
    fontSize: 16,
  },
}); 