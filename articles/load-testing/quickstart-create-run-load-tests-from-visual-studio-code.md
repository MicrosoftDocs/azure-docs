---
title: 'Quickstart: Create and run load tests from Visual Studio Code'
titleSuffix: Azure Load Testing
description: 'This quickstart shows how to create and run load tests using the Visual Studio Code extension for Azure Load Testing. Azure Load Testing is a managed, cloud-based load testing tool.'
services: load-testing
ms.service: azure-load-testing
ms.topic: quickstart
author: nagarjuna-vipparthi
ms.author: vevippar
ms.date: 04/04/2024
---

# Quickstart: Create and run a load test with Visual Studio Code and GitHub Copilot

Learn how to use the Azure Load Testing extension for Visual Studio Code to easily create Locust load tests using Copilot, iterate locally, and scale effortlessly in Azure. Whether you're new to Locust or a performance testing expert, the Azure Load Testing extension streamlines test creation, iteration, and scaling, right from your VS Code environment. Azure Load Testing is a managed service that lets you run a load test at cloud scale. [Locust](https://locust.io/) is an open source load testing tool that enables you to write all your tests in Python code.

This quickstart guides you through generating, refining, and running realistic load tests. By the end, you have a fully functional load test script generated from a **Postman collection**, **Insomnia collection**, or **.http file**, enhanced with Copilot-powered improvements, and ready to scale in **Azure Load Testing**.

## Prerequisites

- Azure Load Testing extension for VS Code. [Download and install it here](https://aka.ms/malt-vscode/get).  
- GitHub Copilot. [Set up Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) to generate and refine test scripts. If you don't have a subscription, you can activate a free trial.
- Python & Locust. Required to run and validate your **Locust** test scripts locally from VS Code. [Install Locust here](https://docs.locust.io/en/stable/installation.html).
- An Azure account with an active subscription. Needed to run load tests at scale in **Azure Load Testing**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!TIP]
> VS Code's GitHub Copilot Chat offers multiple AI models. You can switch models using the model picker in the chat input field. If you're unsure which one to use, we recommend GPT-4o.

## Open the walkthrough  

To get started, open the command palette in VS Code and run: **Load Testing: Open Walkthrough**. This walkthrough provides the key entry points of the extension. 

You can also access the features directly from the command palette by using the **Load Testing** prefix. Some commonly used commands include:  
- Load Testing: Create Locust test
- Load Testing: Run load test (local) 
- Load Testing: Run load test (Azure Load Testing) 

    :::image type="content" source="./media/quickstart-create-run-load-tests-from-visual-studio-code/walkthrough.png" alt-text="Screenshot that shows the key entry points for the Azure Load Testing VS Code extension." lightbox="./media/quickstart-create-run-load-tests-from-visual-studio-code/walkthrough.png":::

## Generate a Locust script with Copilot

You can generate a Locust script from any existing Postman collection, Insomnia collection, or .http file. If the file contains multiple requests, Copilot attempts to sequence them into a cohesive scenario. 

1. Click the **Create a Load Test** button in the walkthrough, or run **Load Testing: Create Locust test** from the command palette.

1. You can choose the source to auto-generate a Locust test script:
    - Selecting a **Postman collection**, **Insomnia collection**, or **.http file** lets Copilot extract multiple API operations, request data, and authentication details—creating a more complete and realistic load test.
    - Choosing **Single URL** allows you to enter a single endpoint URL, generating a simple script you can customize or expand.

1. **For this walkthrough**, you can select **Try Sample: Pet Shop API**, which uses the [**`petstore-sample.http`**](https://aka.ms/malt-vscode/http-sample) file to generate a sample Locust test script. 

1. Copilot analyzes the selected file and generate a **Locust-based load test script**, automatically sequencing API requests to simulate real-world usage and handling authentication securely. 

1. Once the script is generated, the **Copilot Chat** window will suggest other setup steps, such as defining **environment variables**. If Copilot suggests environment variables, create a `.env` file in your project and add the recommended values.  

## Customize the load test script

Before running the test, you can refine it with Copilot. For example, by examining the script, you might notice that the same request payload is sent with every request:  

```python
payload = {
    "id": self.pet_id,
    "name": "Fluffy",
    "category": {"id": 1, "name": "Dogs"},
    "photoUrls": ["https://example.com/photo.jpg"],
    "tags": [{"id": 1, "name": "cute"}],
    "status": "available"
}
```

To make the test more dynamic by randomizing the request payload:

1. Open the **Copilot Chat** panel.
2. Type: `Randomize request payloads` and press Enter.
3. Copilot generates a suggested modification to introduce randomization.
4. Click **Apply in Editor** that appears above the generated code snippet in Copilot Chat window.
5. After reviewing the changes, click **Keep** to accept and update your script.
6. Save the file

Now, each request simulates a more realistic user interaction. The code looks something like the following snippet:

```python
payload = {
    "id": self.pet_id,
    "name": f"Pet{random.randint(1, 1000)}",
    "category": {"id": random.randint(1, 10), "name": random.choice(["Dogs", "Cats", "Birds"])},
    "photoUrls": [f"https://example.com/photo{random.randint(1, 100)}.jpg"],
    "tags": [{"id": random.randint(1, 10), "name": random.choice(["cute", "friendly", "playful"])}],
    "status": random.choice(["available", "pending", "sold"])
}
```

## Run the load test

You can run your load test in two ways:
- Run locally for quick validation
- Run in Azure Load Testing for high-scale, multi-region load

### Run locally for quick validation
To quickly validate your test, run it locally using Locust from **Visual Studio Code**:

1. Open the command palette and run: **Load Testing: Run load test (local)**. 

1. The **Locust web UI** gets automatically launched in a browser. It can take a few seconds for the Locust server to be ready and for the browser to open. 

1. In the **Start new load test** page, review the input fields and click **Start**. Locust starts sending requests, logging any failures, and tracking performance statistics.

    :::image type="content" source="./media/quickstart-create-run-load-tests-from-visual-studio-code/locust-start-new-load-test.png" alt-text="Screenshot that shows the Locust web UI to run a load test locally." lightbox="./media/quickstart-create-run-load-tests-from-visual-studio-code/locust-start-new-load-test.png":::


1. Explore the **Locust UI** to analyze response times, error rates, and request throughput.

    :::image type="content" source="./media/quickstart-create-run-load-tests-from-visual-studio-code/locust-web-ui.png" alt-text="Screenshot that shows the Locust web UI to view and analyze test results locally." lightbox="./media/quickstart-create-run-load-tests-from-visual-studio-code/locust-web-ui.png":::

> [!TIP]
> If Locust reports failures for the `Retrieve Pet` and `Update Pet` requests, it may be due to how the Pet Store API processes requests. Try asking Copilot to "**Add random delays between requests in run_scenario**". If you suspect an issue with the script itself, set `DEBUG_MODE=True` as an environment variable and rerun the test to get more detailed debug information.

If you prefer running the test from a **VS Code Terminal**:  

1. Open a terminal in VS Code.  

1. Run the following command:  
    ```sh
    locust -f path/to/locustfile.py -u 10 -r 2 --run-time 1m
    ```
    * `-f path/to/locustfile.py`: Specifies the Locust test script.
    * `-u 10`: Simulates up to 10 virtual users.
    * `-r 2`: Ramps up two virtual users per second.
    * `--run-time 1m`: Runs the test for 1 minute.
1. Open a browser to `http://0.0.0.0:8089` to view the Locust web UI.

### Scale up in Azure Load Testing

For high-load scenarios where you need to simulate many thousands of concurrent virtual users across multiple regions, you can run your test in **Azure Load Testing**.  

To execute a large-scale test:  

1. Open the **command palette** and run: **Load Testing: Run load test (Azure Load Testing)**.

1. Select **Create a configuration file...**. 

1. Follow the guided setup, which includes:
    - Signing into Azure and selecting your subscription.

    - Creating a new Azure Load Testing resource or selecting an existing one.

    - Choosing load test regions to distribute traffic globally.

1. Once the setup is complete, a YAML configuration file (for example, `loadtest.config.yaml`) is generated and added to your workspace root folder.  
    - This file defines the Locust script, load parameters, environment variables, regions, and any other files (for example, CSV datasets). 

    - Defaults are 200 virtual users running for 120 seconds in each selected region.

    - Commit this file in your repository to reuse and automate future load test executions.  

1. Copilot validates the configuration before execution. Follow any instructions provided in the chat window. Otherwise, if everything checks out, the test script and its related artifacts are uploaded to Azure Load Testing and prepared for execution. This process may take up to a minute, and progress is shown in the **Output** panel.


    :::image type="content" source="./media/quickstart-create-run-load-tests-from-visual-studio-code/load-test-progress.png" alt-text="Screenshot that shows the load test progress in VS Code output console." lightbox="./media/quickstart-create-run-load-tests-from-visual-studio-code/load-test-progress.png":::
1. When the test starts, a notification (toast message) appears in the bottom-right corner of VS Code. Click the **Open in Azure Portal** button to monitor test execution in real time.  

1. When the test starts, a notification (toast message) appears in the bottom-right corner. Click the **Open in Azure Portal** button to monitor test execution in real time.  

    :::image type="content" source="./media/quickstart-create-run-load-tests-from-visual-studio-code/run-load-test-azure.png" alt-text="Screenshot that shows the load test results in Azure Load Testing." lightbox="./media/quickstart-create-run-load-tests-from-visual-studio-code/run-load-test-azure.png":::

> [!TIP]
> To quickly access test results from previous runs, use the command: **Load Testing: View load test runs**.

In this quickstart, sensitive variables like `API_KEY` were stored in a `.env` file and uploaded to the cloud service. However, as a best practice, secrets should be securely managed in **Azure Key Vault**. The extension provides guidance on setting this up.

So far in this quickstart, sensitive variables like `API_KEY` were stored in a `.env` file and uploaded to the cloud service. However, as a best practice, secrets should be securely managed in **Azure Key Vault**. The extension provides guidance on setting this up.

1. Open the **Copilot Chat** window, type `@testing /setupLoadTestSecretsInAzure` and press Enter.

1. Copilot guides you through the following steps:


1. Copilot guides you through:
    - Creating an Azure Key Vault.
    - Assigning a managed identity to your Azure Load Testing resource.
    - Adding secrets to Azure Key Vault.
    - Configuring your YAML file to reference Key Vault secrets instead of `.env`.

Whenever you modify your Locust script or YAML configuration, you can re-run the test by executing **Run load test (Azure Load Testing)**.

## Summary

In this quickstart, you used the Azure Load Testing extension for Visual Studio Code to easily create Locust load tests using Copilot, iterate locally, and scale effortlessly in Azure. Azure Load Testing extension for VS Code simplifies the process of creating a realistic test script for your test scenario. Azure Load Testing abstracts the complexity of setting up the infrastructure for simulating high-scale user load for your application.

You can further expand the load test to also monitor server-side metrics of the application under load, and to specify test fail metrics to get alerted when the application doesn't meet your requirements. To ensure that the application continues to perform well, you can also integrate load testing as part of your continuous integration and continuous deployment (CI/CD) workflow.

## Related content

- Learn how to [monitor server-side metrics for your application](./how-to-monitor-server-side-metrics.md).
- Learn how to configure [automated performance testing with CI/CD](./how-to-configure-load-test-cicd.md).
