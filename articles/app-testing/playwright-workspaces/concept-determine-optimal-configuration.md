---
title: Optimal test suite configuration
titleSuffix: Playwright Workspaces
description: Learn about the factors that affect test completion time in Playwright Workspaces. Get practical steps to determine the optimal Playwright test project configuration.
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.topic: conceptual
ms.date: 08/07/2025
ms.custom: playwright-workspaces
---

# Determine the optimal test suite configuration for Playwright Workspaces

Playwright Workspaces enables you to speed up your Playwright test execution by increasing parallelism at cloud scale. Several factors affect the completion time for your test suite. Determining the optimal configuration for reducing test suite completion time is application-specific and requires experimentation. This article explains the different levels to configure parallelism for your tests, the factors that influence test duration, and how to determine your optimal configuration to minimize test completion time.

In Playwright, you can run tests in parallel by using worker processes. By using Playwright Workspaces, you can further increase parallelism by using cloud-hosted browsers. In general, adding more parallelism reduces the time to complete your test suite. However, adding more worker processes doesn't always result in shorter test suite completion times. For example, the client machine computing resources, network latency, or test complexity might also affect test duration.

The following chart gives an example of running a test suite. By running the test suite with Playwright Workspaces instead of locally, you can significantly increase the parallelism and reduce the test completion time. Notice that, when running with the service, the completion time reaches a minimum limit, after which adding more workers only has a minimal effect. The chart also shows how using more computing resources on the client machine positively affects the test completion time for tests running with the service.

:::image type="content" source="./media/concept-determine-optimal-configuration/playwright-workspaces-parallelization-chart.png" alt-text="Line chart that shows the relation between the number of parallel workers and the test suite completion time for different run environments." lightbox="./media/concept-determine-optimal-configuration/playwright-workspaces-parallelization-chart.png":::

## Worker processes

In [Playwright](https://playwright.dev/docs/intro), all tests run in worker processes. These processes are OS processes, running independently, in parallel, orchestrated by the Playwright Test runner. All workers have identical environments and each process starts its own browser. 

Generally, increasing the number of parallel workers can reduce the time it takes to complete the full test suite. You can learn more about [Playwright Test parallelism](https://playwright.dev/docs/test-parallel) in the Playwright documentation.

As previously shown in the chart, the test suite completion time doesn't continue to decrease as you add more worker processes. There are [other factors that influence the test suite duration](#factors-that-influence-completion-time).

### Run tests locally

By default, `@playwright/test` limits the number of workers to 1/2 of the number of CPU cores on your machine. You can override the number of workers for running your test.

When you run tests locally, the number of worker processes is limited to the number of CPU cores on your machine. Beyond a certain point, adding more workers leads to resource contention, which slows down each worker and introduces test flakiness.

To override the number of workers using the [`--workers` command line flag](https://playwright.dev/docs/test-cli#reference):

```bash
npx playwright test --workers=10
```

To specify the number of workers in `playwright.config.ts` using the `workers` setting:

```typescript
export default defineConfig({
  ...
  workers: 10,
  ...
});
```

### Run tests with the service

When you use Playwright Workspaces, you can increase the number of workers at cloud-scale to larger numbers. When you use the service, the worker processes continue to run locally, but the resource-intensive browser instances are now running remotely in the cloud.

Because the worker processes still run on the client machine (developer workstation or CI agent machine), the client machine might still become a bottleneck for scalable execution as you add more workers. Learn how you can [determine the optimal configuration](#workflow-for-determining-your-optimal-configuration).

You can specify the number of workers on the command line with the `--workers` flag:

```bash
npx playwright test --config=playwright.service.config.ts --workers=30
```

Alternately you can specify the number of workers in `playwright.service.config.ts` using the `workers` setting:

```typescript
export default defineConfig({
  ...
  workers: 30,
  ...
});
```

## Factors that influence completion time

In addition to the number of parallel worker processes, there are several factors that influence the test suite completion time.

| Factor | Effects on test duration |
|-|-|
| **Client machine compute resources** | The worker processes still run on the client machine (developer workstation or CI agent machine) and need to communicate with the remote browsers. Increasing the number of parallel workers might result in resource contention on the client machine, and slow down tests. |
| **Complexity of the test code** | As the complexity of the test code increases, the time to complete the tests might also increase. |
| **Latency between the client machine and the remote browsers** | The workers run on the client machine and communicate with the remote browsers. Depending on the Azure region where the browsers are hosted, the network latency might increase. Learn how you can [optimize regional latency in Playwright Workspaces](./how-to-optimize-regional-latency.md). |
| **Playwright configuration settings** | Playwright settings such as service timeouts, retries, or tracing can adversely affect the test completion time. Experiment with the optimal configuration for these settings when running your tests in the cloud. |
| **Target application's load-handling capacity** | Running tests with Playwright Workspaces enables you to run with higher parallelism, which results in a higher load on the target application. Verify that the application can handle the load that is generated by running your Playwright tests. |

Learn more about the [workflow for determining the optimal configuration](#workflow-for-determining-your-optimal-configuration) for minimizing the test suite duration.

## Workflow for determining your optimal configuration

The optimal configuration for minimizing the test suite completion time is specific to your application and environment. To determine your optimal configuration, experiment with different levels of parallelization, client machine hardware configuration, or test suite setup.

The following approach can help you find the optimal configuration for running your tests with Playwright Workspaces:

### 1. Determine your test completion time goal

Determine what is an acceptable test suite completion time and associated cost per test run.

Depending on the scenario, your requirements for test completion might be different. When you're running your end-to-end tests with every code change, as part of a continuous integration (CI) workflow, minimizing test completion time is essential. When you schedule your end-to-end tests in a (nightly) batch run, you might have requirements that are less demanding.

### 2. Verify that your tests run correctly on the client machine

Before you run your Playwright test suite with Playwright Workspaces, make sure that your tests run correctly on your client machine. If you run your tests as part of a CI workflow, validate that your tests run correctly on the CI agent machine. Ensure that you run your tests with a minimum of two parallel workers to verify that your tests are properly configured for parallel execution. Learn more about [parallelism in Playwright](https://playwright.dev/docs/test-parallel).

### 3. Run with cloud-hosted browsers on Playwright Workspaces

Once your tests run correctly, add the service configuration to run your tests on cloud-hosted browsers with the service. Validate that your tests continue to run correctly from your client machine (developer workstation or CI agent machine).

Get started with the [Quickstart: run Playwright tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md).

### 4. Verify the Azure region remote browsers

Playwright Workspaces can use remote browsers in the Azure region that's nearest to your client machine, or use the fixed region on which your workspace was created.

Learn how you can [optimize regional latency for your workspace](./how-to-optimize-regional-latency.md).

### 5. Experiment with the number of parallel workers

Experiment with the number of parallel workers to run your tests. Measure the test completion time and compare against the target goal you set previously. 

Notice at which point the test completion time no longer reduces as you add more workers. Move to the next step to further optimize your setup.

> [!NOTE]
> The number of [parallel workers per workspace is limited](./resource-limits-quotas-capacity.md) to 100. You can [request an increase of this limit for your workspace](https://aka.ms/pww/feedback).

### 6. Scale the client

As you increase parallelism, the client machine might experience compute resource contention. Increase the computing resources on the client machine, for example by selecting [larger GitHub-hosted runners](https://docs.github.com/actions/using-github-hosted-runners/about-larger-runners).

Alternatively, if you have hardware limitations, you can [shard](https://playwright.dev/docs/test-sharding) your client tests.

Rerun your tests and experiment with the number of parallel workers.

### 7. Update your Playwright test configuration settings

Configure your Playwright test configuration settings, such as test [timeouts](https://playwright.dev/docs/test-timeouts), [trace](https://playwright.dev/docs/api/class-testoptions#test-options-trace) settings, or [retries](https://playwright.dev/docs/test-retries).

## Related content

- [Run your Playwright tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md)
- [What is Playwright Workspaces](./overview-what-is-microsoft-playwright-workspaces.md)
