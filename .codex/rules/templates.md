# ファイル作成時のテンプレート

## 新規 service

```python
from src.schemas.xxx import XxxResponse


class XxxService:
    async def run(self) -> XxxResponse:
        return XxxResponse(...)
```

## 新規 router

```python
from fastapi import APIRouter

from src.schemas.xxx import XxxResponse
from src.services.xxx_service import XxxService

router = APIRouter(prefix="/xxx", tags=["xxx"])
_xxx_service = XxxService()


@router.get("")
async def get_xxx() -> XxxResponse:
    return await _xxx_service.run()
```

## 新規 repository

```python
from sqlalchemy.ext.asyncio import AsyncSession


class XxxRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_items(self) -> list[object]:
        return []
```
