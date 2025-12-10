import { test, expect } from '@playwright/test';

test.describe('Entity Selection Flow', () => {
  test('should select and confirm image selection', async ({ page }) => {
    await page.goto('http://localhost:8530');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Image Cook');

    // Wait for entities to load (grid should be visible)
    const entityGrid = page.locator('[data-testid="entity-list"]');
    await expect(entityGrid).toBeVisible();

    // Find first entity card (assumption: first card has no selection in DB)
    const firstCard = page.locator('[data-testid="entity-card"]').first();
    await expect(firstCard).toBeVisible();

    // Verify first card has no "✓ Selected" badge (i.e., no existing selection)
    await expect(firstCard.locator('text=✓ Selected')).not.toBeVisible();

    // Click on first image thumbnail to select it
    const firstThumbnail = firstCard.locator('[data-testid="image-thumbnail"]').first();
    await expect(firstThumbnail).toBeVisible();
    await firstThumbnail.click();

    // Confirm button should appear in bottom-right corner
    const confirmBtn = page.locator('button:has-text("Confirm")');
    await expect(confirmBtn).toBeVisible();
    await expect(confirmBtn).toContainText('1 Selection');

    // Click confirm
    await confirmBtn.click();

    // Should show processing state
    await expect(page.locator('text=Processing')).toBeVisible();

    // After processing, should show selected badge (wait up to 10s for backend + refresh)
    await expect(firstCard.locator('text=✓ Selected')).toBeVisible({ timeout: 10000 });

    // Card should now be collapsed with winner displayed
    await expect(firstCard.locator('button:has-text("View all variations")')).toBeVisible();
  });

  test.describe('Additional scenarios', () => {
    test.skip('should handle deselection using "Select Again" button', async () => {
    });

    test.skip('should support multiple batch selections', async () => {
    });

    test.skip('should toggle pending selection by clicking same image twice', async () => {
    });

    test.skip('should show error when backend is down', async () => {
    });
  });
});
