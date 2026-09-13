import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient


BACKEND_DIRECTORY = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(BACKEND_DIRECTORY))

from main import app  # noqa: E402


class ApiTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_root(self) -> None:
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["service"], "personal-page-api")

    def test_health(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_profile(self) -> None:
        response = self.client.get("/api/profile")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "connected")
        self.assertIn("server_time", response.json())

    def test_profile_allows_project_vercel_origin(self) -> None:
        origin = (
            "https://cloud-computing-assignment-git-main-"
            "kaist-ksroh.vercel.app"
        )
        response = self.client.get("/api/profile", headers={"Origin": origin})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], origin)

    def test_profile_rejects_unrelated_vercel_origin(self) -> None:
        response = self.client.get(
            "/api/profile",
            headers={"Origin": "https://unrelated-project.vercel.app"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertNotIn("access-control-allow-origin", response.headers)


if __name__ == "__main__":
    unittest.main()
