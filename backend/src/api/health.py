from fastapi import APIRouter

from src.schemas.health import HealthResponse
from src.services.health_service import HealthService

router = APIRouter(tags=["health"])
_health_service = HealthService()


@router.get("/health")
async def get_health() -> HealthResponse:
    return _health_service.check()
