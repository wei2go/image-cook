interface Props {
  image: { url: string; model: string; version: number };
  isSelected: boolean;
  onClick: () => void;
}

export function ImageThumbnail({ image, isSelected, onClick }: Props) {
  return (
    <div
      className={`
        relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'}
      `}
      onClick={onClick}
    >
      <div className="relative w-full aspect-square bg-gray-100">
        <img
          src={image.url}
          alt={`${image.model}-v${image.version}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Model and version label */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
        {image.model}-v{image.version}
      </div>

      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
    </div>
  );
}
