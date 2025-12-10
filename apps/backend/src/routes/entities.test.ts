import request from "supertest";
import { app } from "../app";
import { firestoreService } from "../services/firestore-service";

jest.mock("../services/firestore-service");

describe("Entities Routes", () => {
  describe("GET /entities", () => {
    it("should return all entities", async () => {
      const mockEntities = [
        { id: "test-entity", name: "Test Entity", category: "enemy" },
      ];

      (firestoreService.getAllEntities as jest.Mock).mockResolvedValue(
        mockEntities,
      );

      const response = await request(app).get("/entities");

      expect(response.status).toBe(200);
      expect(response.body.entities).toEqual(mockEntities);
      expect(response.body.count).toBe(1);
    });

    it("should filter by category", async () => {
      (firestoreService.getAllEntities as jest.Mock).mockResolvedValue([]);

      await request(app).get("/entities?category=enemy");

      expect(firestoreService.getAllEntities).toHaveBeenCalledWith("enemy");
    });
  });

  describe("POST /entities/init", () => {
    it("should return 400 if entities array missing", async () => {
      const response = await request(app)
        .post("/entities/init")
        .send({ category: "enemy" });

      expect(response.status).toBe(400);
    });
  });
});
