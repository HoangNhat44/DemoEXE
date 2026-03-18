import { getCategoryIcon } from '../../utils/categoryIcons';

function CategoryFilter({ activeCategory, categories, onCategoryChange }) {
  return (
    <div className="category-row">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.iconKey);
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
