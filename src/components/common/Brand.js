import { Camera } from 'lucide-react';

function Brand({ className = 'brand' }) {
  return (
    <div className={className}>
      <span className="brand-mark">
        <Camera size={16} />
      </span>
      <span>MATCHA</span>
    </div>
  );
}

export default Brand;
