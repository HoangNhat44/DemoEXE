import { categories } from '../../data/categories';

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-row">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = category.id === activeCategory;

        return (
          <button
            key={category.id}
            className={`category-pill ${isActive ? 'active' : ''}`}
            type="button"
            onClick={() => onCategoryChange(category.id)}
          >
            <Icon size={18} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
