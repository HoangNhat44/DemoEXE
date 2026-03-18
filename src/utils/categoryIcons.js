import { Camera, Home, Scissors, Shirt, Sparkles, UserCheck } from 'lucide-react';

const iconMap = {
  sparkles: Sparkles,
  camera: Camera,
  scissors: Scissors,
  shirt: Shirt,
  userCheck: UserCheck,
  home: Home,
};

export function getCategoryIcon(iconKey) {
  return iconMap[iconKey] || Sparkles;
}
