import { Camera, Home, Scissors, Shirt, Sparkles, UserCheck } from 'lucide-react';

export const categories = [
  { id: 'all', label: 'Tất cả', icon: Sparkles },
  { id: 'photographer', label: 'Nhiếp ảnh gia', icon: Camera },
  { id: 'makeup', label: 'Makeup Artist', icon: Scissors },
  { id: 'wardrobe', label: 'Thuê trang phục', icon: Shirt },
  { id: 'model', label: 'Người mẫu', icon: UserCheck },
  { id: 'studio', label: 'Studio & Concept', icon: Home },
];
