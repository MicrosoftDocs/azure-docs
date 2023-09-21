---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 09/27/2023
---

### Tests are failing because of a timeout

Your tests could be timing out because of the following reasons:

1. Your client machine is in a different region than the browsers.

    Connecting to service-hosted browsers introduces network latency. You might need to increase your [timeout settings in the Playwright configuration](https://playwright.dev/docs/test-timeouts). Start with increasing the *test timeout* setting in `playwright.service.config.ts`.

1. Trace files cause performance issues (currently a known problem).

    Sending the Playwright trace files from the service to the client machine can create congestion, which can cause tests to fail due to a timeout.You can [disable tracing in the Playwright configuration file](https://playwright.dev/docs/api/class-testoptions#test-options-trace).
