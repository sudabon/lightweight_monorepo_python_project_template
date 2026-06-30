from typing import Annotated

from fastapi import APIRouter, Depends

from src.schemas.health import HealthResponse
from src.services.health_service import HealthService

router = APIRouter(tags=["health"])


def get_health_service() -> HealthService:
    return HealthService()


@router.get("/health")
async def get_health(
    health_service: Annotated[HealthService, Depends(get_health_service)],
) -> HealthResponse:
    return health_service.check()
