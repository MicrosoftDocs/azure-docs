---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 11/19/2024
---
 

1. After your test run completes, you get a link to the Playwright portal in your terminal. Open this link to view detailed test results and associated artifacts. The portal displays essential information, including:
    - CI build details
    - Overall test run status
    - The commit ID linked to the test run
    
    :::image type="content" source="../media/include-playwright-portal-view-test-results-nunit/playwright-testing-open-test-run.png" alt-text="Screenshot that shows list of tests in the test run." lightbox="../media/include-playwright-portal-view-test-results/playwright-testing-open-test-run.png":::

3. The Playwright portal provides all the necessary information for troubleshooting. You can:
    - View detailed error logs, and attached artifacts such as screenshots or videos.
    - Navigate directly to the **Trace Viewer** for deeper analysis. 

    :::image type="content" source="../media/include-playwright-portal-view-test-results-nunit/playwright-testing-open-test.png" alt-text="Screenshot that shows the preview of a test." lightbox="../media/include-playwright-portal-view-test-results/playwright-testing-open-test.png":::

> [!NOTE]
> Some metadata, such as the owner, description, and category, is currently not displayed on the service dashboard. If there’s additional information you’d like to see included, please submit a [GitHub issue in our repository](https://aka.ms/mpt/feedback).

4. The Trace Viewer allows you to step through your test execution visually. You can:
    - Use the timeline to hover over individual steps, revealing the page state before and after each action.
    - Inspect detailed logs, DOM snapshots, network activity, errors, and console output for each step.

    :::image type="content" source="../media/include-playwright-portal-view-test-results-nunit/playwright-testing-trace-viewer.png" alt-text="Screenshot that shows the trace viewer." lightbox="../media/include-playwright-portal-view-test-results/playwright-testing-trace-viewer.png":::

