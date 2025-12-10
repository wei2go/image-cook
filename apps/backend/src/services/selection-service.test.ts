describe('Selection Service', () => {
  describe('approveImage', () => {
    it.todo('should download generated image');
    it.todo('should compress image to JPEG');
    it.todo('should upload to winners/ folder');
    it.todo('should update entity with selectedImage');
    it.todo('should throw error if entity not found');
    it.todo('should throw error if generated image not found');
  });

  describe('deselectImage', () => {
    it.todo('should delete winner image from Storage');
    it.todo('should update entity to remove selectedImage');
    it.todo('should handle entity without selectedImage gracefully');
  });
});
