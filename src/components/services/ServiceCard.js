import { Search, Star } from 'lucide-react';

function ServiceCard({ service, onOpenService }) {
  function handleOpen() {
    onOpenService(service.id);
  }

  return (
    <article
      className="service-card service-card-clickable"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="service-cover" style={{ backgroundImage: `url(${service.image})` }}>
        <span className="service-tag">{service.categoryLabel}</span>
        <div className="service-rating">
          <Star size={14} fill="currentColor" />
          <span>{service.rating}</span>
        </div>
      </div>

      <div className="service-body">
        <div className="provider-row">
          <img src={service.avatar} alt={service.provider} />
          <div>
            <h3>{service.title}</h3>
            <p>{service.provider}</p>
          </div>
        </div>

        <div className="service-footer">
          <strong>{service.price}</strong>
          <button
            className="ghost-button"
            type="button"
            aria-label={`Xem chi tiết ${service.title}`}
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
