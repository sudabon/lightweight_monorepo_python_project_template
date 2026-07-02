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
from typing import Annotated

from fastapi import APIRouter, Depends

from src.schemas.xxx import XxxResponse
from src.services.xxx_service import XxxService

router = APIRouter(prefix="/xxx", tags=["xxx"])


def get_xxx_service() -> XxxService:
    return XxxService()


@router.get("")
async def get_xxx(
    xxx_service: Annotated[XxxService, Depends(get_xxx_service)],
) -> XxxResponse:
    return await xxx_service.run()
```

## 新規 repository

```python
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.xxx import XxxModel  # 実テーブル導入時に作成するモデル型


class XxxRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_items(self) -> list[XxxModel]:
        return []
```
