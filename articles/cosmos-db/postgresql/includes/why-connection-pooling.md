---
author: jonels-msft
ms.author: jonels
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: include
ms.date: 07/26/2022
---

> [!TIP]
>
> The sample code below uses a connection pool to create and manage connections
> to PostgreSQL. Application-side connection pooling is strongly recommended
> because:
>
> * It ensures that the application doesn't generate too many connections to
>   the database, and so avoids exceeding connection limits.
> * It can help drastically improve performance--both latency and throughput.
>   The PostgreSQL server process must fork to handle each new connection, and
>   reusing a connection avoids that overhead.
