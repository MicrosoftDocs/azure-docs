---
title: Optimal test suite configuration
description: Learn about the factors that affect test completion time in Microsoft Playwright Testing. Get practical steps to determine the optimal Playwright test project configuration.
ms.topic: conceptual
ms.date: 08/24/2023
ms.custom: playwright-testing-preview
---

# Determine the optimal test suite configuration

Microsoft Playwright Testing enables you to run Playwright tests with high parallelization across parallel workers. However, adding more parallel workers doesn't always result in shorter test suite completion times. Several factors influence the optimizal configuration for minimizing the test duration, such as the computing resources on the client machine, test complexity, or the target application's load-handling capacity.
This article explains different factors that affect the test suite completion, and provides practical steps to determine the optimal test project configuration.

## Factors that influence the test suite completion time

A key factor that influences the time it takes to complete a test suite, is the size of the test suite. The test suite size is determined by the number of tests times the number of browser and operating system combinations. For example, if you have 100 tests that you want to run across 3 browsers, and 2 operating systems, you end up with 100 * 3 * 2 = 600 tests runs.

Playwright supports running multiple tests in parallel by using *workers*. With Microsoft Playwright Testing, you can further scale your test suite across cloud-hosted parallel workers. By using parallelization, you can shorten the overall time to complete all tests in the test suite.

You might be tempted to run your test suite across as many parallel workers as possible to minize the test suite completion time. However, adding more parallel workers doesn't always result in a shorter test completion. There are multiple factors that influence the test suite duration, and that might limit the performance gains of adding more parallelization. Specifically, the computing resources of the client machine that runs the Playwright test code, can have a significant affect.

The following graph shows how the test suite completion time evolves as you increase parallelization. Initially the number of parallel workers significantly shortens the test completion time. As you add more workers, the gains become smaller and might even adversely influence the test duration. Notice how using more computing resources on the client machine (orange line) can further improve the benefits of parallelization. The client machine is responsible for running the Playwright tests and, depending on the complexity of the test code, benefits from additional CPU, memory, or networking resources.

:::image type="complex" source="./media/concept-determine-optimal-configuration/playwright-testing-parallelization-chart.png" alt-text="Line chart that shows the relation between the number of parallel workers and the test suite completion time for different run environments." lightbox="./media/concept-determine-optimal-configuration/playwright-testing-parallelization-chart.png":::
Line chart that shows the relation between the number of parallel workers, on the X-axis, and the test suite completion time (Y-axis). The chart has a data series for where the tests are being run: small-powered client machine, high-powered client machine, Playwright Testing with a low-powered client machine, and Playwright Testing with a high-powered client machine. The data shows that when running on the client machine, the performance initially improves but quickly degrades with more workers because of resource contention. When running with Playwright Testing, the performance increases are much higher and last longer by adding more workers. Using a high-powered client machine positively affects both running on the client machine, as well as running with the service.
:::image-end:::

Other factors that might influence the test completion time are:

- The target application's load-handling capacity
- The complexity of the test code
- The latency between the client machine and the cloud-hosted workers
- The Playwright configuration settings, such as timeouts, retries, or tracing


## Process for determining the optimal configuration

The optimal configuration for minimizing the test suite completion time is specific to your application and environment. To determine your optimal configuration, experiment with different levels of parallelization and environment configuration.

Depending on the scenario, your requirements for test completion might also differ. When you're running your end-to-end tests with every code change, as part of a continuous integration (CI) workflow, minimizing test completion time is essential. When you schedule your end-to-end tests in a (nightly) batch run, you might have requirements that are less demanding.

The following approach can help you find the optimal configuration for running your tests with Microsoft Playwright Testing:

1. Set your test completion time goal
1. Make sure your Playwright tests run correctly on your client machine
1. Configure your tests to run on Microsoft Playwright Testing. Run your tests from the expected client machine (CI agent, developer workstation).
1. Experiment with the number of parallel workers and detemine your performance graph
1. Increase the computing resources on the client machine and experiment with the number of parallel workers
1. Configure your Playwright test configuration settings

You can now use the results of these experiments and the performance graphs to determine the optimal number of parallel workers to meet your test completion time goal.

## Related content

- [Run your Playwright tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md)
- [What is Microsoft Playwright Testing](./overview-what-is-microsoft-playwright-testing.md)
