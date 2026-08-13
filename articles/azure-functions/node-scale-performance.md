---
title: Optimize performance and scaling for Node.js Azure Functions
description: Learn how to optimize Node.js Azure Functions for high throughput, efficient scaling, and low latency under load.
ms.topic: concept-article
ms.date: 07/16/2026
ms.devlang: javascript
ms.custom: 
  - devx-track-js
zone_pivot_groups: functions-nodejs-model
---

# Optimize performance and scaling for Node.js Azure Functions

When developing for Azure Functions by using TypeScript and Node.js, you need to understand how your functions perform and how that performance affects the way your function app scales. This understanding is more important when designing highly performant apps. The main factors to consider when designing, writing, and configuring your function apps are horizontal scaling, throughput performance configurations, and Node.js-specific optimizations.

## Horizontal scaling

By default, Azure Functions automatically monitors the load on your application and creates more host instances for Node.js as needed. Azure Functions uses built-in thresholds for different trigger types to decide when to add instances, such as the age of messages and queue size for `QueueTrigger`. You can't configure these thresholds. For more information, see [Event-driven scaling in Azure Functions](event-driven-scaling.md).

To improve the scaling of your Node.js function app, follow this approach in order:

1. Start with default settings and optimize your code first by using async I/O patterns.
1. Scale out (add more instances) before you scale up the worker process count.
1. Increase `FUNCTIONS_WORKER_PROCESS_COUNT` only after load testing shows CPU saturation on each instance.
1. For I/O-bound workloads, keep the worker count conservative and focus on reducing blocking calls and dependency latency.
1. Re-test after each change and monitor throughput, latency, and error rates to validate improvements.

## Improving throughput performance

The default configurations are suitable for most Azure Functions applications. However, you can improve the performance of your applications' throughput by employing configurations based on your workload profile. The first step is to understand the type of workload that you're running.

| Workload type | Function app characteristics | Examples |
| --- | --- | --- |
| **I/O-bound** | • App needs to handle many concurrent invocations.<br>• App processes a large number of I/O events, such as network calls and disk read/writes. | • Web APIs<br>• Database operations<br>• File processing |
| **CPU-bound** | • App does long-running computations, such as image processing.<br>• App does data transformation or complex calculations. | • Data processing<br>• Content transformation<br>• Algorithm execution |

As real-world function workloads are usually a mix of I/O and CPU bound, profile the app under realistic production loads. The following sections cover specific optimizations:

* [Async/await patterns](#asyncawait-patterns)
* [Multiple language worker processes](#use-multiple-language-worker-processes)  
* [Event loop optimization](#event-loop-optimization)
* [Memory management](#memory-management)
* [Code optimization](#code-optimization)

### Async/await patterns

Node.js is built on an event-driven, non-blocking I/O model that makes it lightweight and efficient for I/O-bound operations. For applications that process a large number of I/O events or are I/O bound, you can improve performance significantly by using proper async/await patterns:

- **Use `Promise.all()` for parallel operations**: When you have multiple independent async operations, run them in parallel rather than sequentially.
- **Avoid blocking the event loop**: Don't use synchronous operations in async functions.
- **Use streaming for large data**: Process large datasets using streams rather than loading everything into memory.
- **Implement proper error handling**: Use try/catch blocks and handle Promise rejections.

The following example demonstrates parallel async operations with `Promise.all()`:

::: zone pivot="nodejs-model-v4"

#### [JavaScript](#tab/javascript)

```javascript
const { app } = require('@azure/functions');

app.http('optimizedHttpTrigger', {
    methods: ['GET', 'POST'],
    handler: async (request, context) => {
        // Good: Using async/await for HTTP calls
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        
        // Good: Parallel async operations
        const [user, orders] = await Promise.all([
            fetchUser(data.userId),
            fetchOrders(data.userId)
        ]);
        
        return { 
            jsonBody: { user, orders }
        };
    }
});

async function fetchUser(userId) {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return await response.json();
}

async function fetchOrders(userId) {
    const response = await fetch(`https://api.example.com/orders?userId=${userId}`);
    return await response.json();
}
```

#### [TypeScript](#tab/typescript)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Order {
    id: string;
    userId: string;
    amount: number;
}

async function optimizedHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // Good: Using async/await for HTTP calls
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // Good: Parallel async operations
    const [user, orders] = await Promise.all([
        fetchUser(data.userId),
        fetchOrders(data.userId)
    ]);
    
    return { 
        jsonBody: { user, orders }
    };
}

async function fetchUser(userId: string): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return await response.json();
}

async function fetchOrders(userId: string): Promise<Order[]> {
    const response = await fetch(`https://api.example.com/orders?userId=${userId}`);
    return await response.json();
}

app.http('optimizedHttpTrigger', {
    methods: ['GET', 'POST'],
    handler: optimizedHttpTrigger
});
```

---

::: zone-end

::: zone pivot="nodejs-model-v3"

#### [JavaScript](#tab/javascript)

```javascript
module.exports = async function (context, req) {
    // Good: Using async/await for HTTP calls
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // Good: Parallel async operations
    const [user, orders] = await Promise.all([
        fetchUser(data.userId),
        fetchOrders(data.userId)
    ]);
    
    context.res = {
        body: { user, orders }
    };
};

async function fetchUser(userId) {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return await response.json();
}

async function fetchOrders(userId) {
    const response = await fetch(`https://api.example.com/orders?userId=${userId}`);
    return await response.json();
}
```

#### [TypeScript](#tab/typescript)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface User {
    id: string;
    name: string;
    email: string;
}

interface Order {
    id: string;
    userId: string;
    amount: number;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Good: Using async/await for HTTP calls
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // Good: Parallel async operations
    const [user, orders] = await Promise.all([
        fetchUser(data.userId),
        fetchOrders(data.userId)
    ]);
    
    context.res = {
        body: { user, orders }
    };
};

async function fetchUser(userId: string): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return await response.json();
}

async function fetchOrders(userId: string): Promise<Order[]> {
    const response = await fetch(`https://api.example.com/orders?userId=${userId}`);
    return await response.json();
}

export default httpTrigger;
```

---

::: zone-end

### Use multiple language worker processes

By default, every Functions host instance has a single language worker process. You can increase the number of worker processes per host (up to 10) by using the [`FUNCTIONS_WORKER_PROCESS_COUNT`](functions-app-settings.md#functions_worker_process_count) application setting. Azure Functions then tries to evenly distribute simultaneous function invocations across these workers.

> [!WARNING]
> Use the `FUNCTIONS_WORKER_PROCESS_COUNT` setting with caution. Multiple processes running in the same instance can lead to unpredictable behavior and increase function load times. If you use this setting, [running from a package file](./run-functions-from-deployment-package.md) can offset these downsides.


For CPU-bound apps, set the number of language workers to be the same as or higher than the number of cores that are available per function app. To learn more, see [Available instance SKUs](functions-premium-plan.md#available-instance-skus).

I/O-bound apps might also benefit from increasing the number of worker processes beyond the number of cores available. Keep in mind that setting the number of workers too high can affect overall performance due to the increased number of required context switches.

### Event loop optimization

Node.js uses a single-threaded event loop to handle I/O operations. Optimizing how your code interacts with the event loop is crucial for performance.

#### Keep the event loop free

Synchronous loops that perform heavy computation block the event loop and prevent other invocations from being processed. Instead, break large datasets into batches and yield control between batches with `setImmediate`:

```typescript
async function processDataNonBlocking(data: any[]) {
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        await Promise.all(
            batch.map(item => processItem(item))
        );
        
        // Allow event loop to process other tasks
        await new Promise(resolve => setImmediate(resolve));
    }
}
```

#### Monitor event loop delay

Use the following pattern to measure how long tasks wait in the event loop queue:

```typescript
import { performance } from 'perf_hooks';

function measureEventLoopDelay(context: any) {
    const start = performance.now();
    setImmediate(() => {
        const delay = performance.now() - start;
        context.log(`Event loop delay: ${delay}ms`);
    });
}
```

### Memory management

Efficient memory usage is critical for Azure Functions performance, especially regarding cold starts and scaling. Follow these general guidelines when optimizing your memory usage:

+ **Minimize global variables**: Heavy objects in global scope affect cold start times.
+ **Use connection pooling**: Reuse database connections and HTTP clients.
+ **Clean up resources**: Properly close connections and clear timers.

```typescript
import { app, InvocationContext, Timer } from '@azure/functions';

// Good: Connection pooling
class DatabaseManager {
    private static instance: DatabaseManager;
    private connectionPool: any;
    
    private constructor() {
        this.connectionPool = createConnectionPool({
            max: 10,
            min: 2,
            idleTimeoutMillis: 30000
        });
    }
    
    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    
    public async query(sql: string): Promise<any> {
        const client = await this.connectionPool.connect();
        try {
            return await client.query(sql);
        } finally {
            client.release();
        }
    }
}

async function timerTrigger(myTimer: Timer, context: InvocationContext): Promise<void> {
    const db = DatabaseManager.getInstance();
    const results = await db.query('SELECT * FROM users');
    
    context.log(`Processed ${results.length} users`);
}

app.timer('timerTrigger', {
    schedule: '0 */5 * * * *',
    handler: timerTrigger
});
```

### Code optimization

You can further optimize your code by bundling your app, using a lazy loading strategy, and optimizing your data structures.

#### Bundle your dependencies

Use bundling tools like esbuild, webpack, or rollup to combine your function app into fewer files. Bundling reduces the number of files the runtime loads during cold start, which directly improves startup time, especially for apps with large dependency trees. For more information, see [Bundle before deployment](typescript-build-options.md#bundle-before-deployment).

#### Minimize module loading time

Loading heavy modules at the global scope increases cold start time because every import runs before the first invocation. Use dynamic imports to defer loading until the module is actually needed:

```typescript
async function processData(data: any) {
    const { heavyFunction } = await import('heavy-library');
    return heavyFunction(data);
}
```

#### Use efficient data structures

When you need to look up items frequently, use a `Map` instead of `Array.find()`. A `Map` provides O(1) lookups compared to O(n) for array scanning:

```typescript
const userMap = new Map();
const users = await fetchUsers();
users.forEach(user => userMap.set(user.id, user));

const user = userMap.get(userId); // O(1) lookup
```

## Monitoring and profiling

Use `context.log()` to track execution timing within your function handler. For custom metrics and dependency tracking, use the [Application Insights Node.js SDK](https://github.com/microsoft/applicationinsights-node.js) directly. For more information, see [Track custom data](functions-reference-node.md#track-custom-data).

The following example logs execution duration and memory usage:

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

async function trackedFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage().heapUsed;

    try {
        const result = await processData(request);

        const duration = Date.now() - startTime;
        const memoryDelta = (process.memoryUsage().heapUsed - memoryBefore) / 1024 / 1024;

        context.log(`Execution time: ${duration}ms, Memory delta: ${memoryDelta.toFixed(2)}MB`);

        return { jsonBody: result };
    } catch (error) {
        context.error(`Function failed after ${Date.now() - startTime}ms`, error);
        throw error;
    }
}

app.http('trackedFunction', {
    methods: ['GET', 'POST'],
    handler: trackedFunction
});
```

By following these recommendations, you can significantly improve the performance and scalability of your Node.js Azure Functions applications.

## Related articles

- [Azure Functions developer reference guide for Node.js apps](functions-reference-node.md)
- [TypeScript build options](typescript-build-options.md)
- [Event-driven scaling in Azure Functions](event-driven-scaling.md)
- [Monitor Azure Functions](functions-monitoring.md)