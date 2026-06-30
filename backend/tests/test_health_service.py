from src.services.health_service import HealthService


def test_health_service_returns_ok_status() -> None:
    response = HealthService().check()

    assert response.status == "ok"
