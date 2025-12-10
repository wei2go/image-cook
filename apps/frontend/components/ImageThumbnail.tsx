import Image from 'next/image';

interface Props {
  image: { url: string; model: string; version: number };
  isPendingSelected: boolean;
  isSavedSelected: boolean;
  onClick: () => void;
}

export function ImageThumbnail({ image, isPendingSelected, isSavedSelected, onClick }: Props) {
  return (
    <div
      className={`
        relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
        ${isPendingSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'}
        ${isSavedSelected ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300 hover:border-gray-400'}
      `}
      onClick={onClick}
    >
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={image.url}
          alt={`${image.model}-v${image.version}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
        />
      </div>

      {/* Model and version label */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
        {image.model}-v{image.version}
      </div>

      {/* Selection checkmark */}
      {(isPendingSelected || isSavedSelected) && (
        <div className={`absolute top-2 right-2 rounded-full p-1 ${isPendingSelected ? 'bg-blue-500' : 'bg-red-500'}`}>
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
