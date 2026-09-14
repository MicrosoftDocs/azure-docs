---
title: What is Playwright Workspaces?
titleSuffix: Playwright Workspaces
description: 'Run browser automation, AI-powered workflows, and Playwright tests on managed cloud browsers. Playwright Workspaces simplifies browser infrastructure while delivering scale, security, and cross-browser execution for modern web applications.'
ms.topic: overview
ms.date: 08/07/2025
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: johnsta
ms.author: johnsta
ms.custom: playwright-workspaces
---

# What is Playwright Workspaces?

Playwright Workspaces is a fully managed cloud browser platform for testing applications, automating browser workflows, and powering AI agents through browser interactions. Playwright Workspaces provides scalable cloud-hosted browsers, enterprise-grade security, observability, and debugging capabilities without requiring you to manage browser infrastructure. Whether you're running end-to-end tests, automating business workflows, or building browser-based AI agents, Playwright Workspaces helps you execute browser interactions reliably at scale.

Get started:
- [Quickstart: Run your Playwright tests at scale](./quickstart-run-end-to-end-tests.md).
- [Quickstart: Automate browser tasks](./quickstart-automate-browser-tasks-remote-mcp.md).


## Why use Playwright Workspaces?

Modern applications and workflows increasingly depend on browser interactions. Managing browser infrastructure, scaling execution, troubleshooting failures, and securing credentials can become operationally complex.
Playwright Workspaces removes this complexity by providing:

- Fully managed cloud browsers
- Scalable browser execution
- Enterprise-grade security and isolation
- Built-in debugging and observability
- Session recordings and execution artifacts
- Integration with Playwright tooling and AI agent frameworks
- Centralized workspace management

## Common scenarios

### Test applications at scale

Run Playwright tests on cloud-hosted browsers without maintaining your own test infrastructure.

Common testing scenarios include:
- End-to-end testing
- Functional testing
- Regression testing
- Cross-browser validation
- CI/CD automation
- Large-scale parallel test execution

By using Playwright Workspaces, test engineers can scale browser execution while maintaining visibility into failures through logs, recordings, traces, and debugging tools. To learn more, see [running your Playwright tests at scale](./overview-run-playwright-tests-at-scale.md).

### Build AI-powered browser automation agents

Use Playwright Workspaces to add browser automation tools to AI agents. Agents can connect to managed cloud browsers to interact with websites, applications, and business systems without relying on local machines or self-managed browser infrastructure.

By using Playwright Workspaces, AI agents can:

- Navigate websites and web applications
- Read, validate, and extract information
- Complete and submit forms
- Interact with authenticated applications
- Automate repetitive business processes
- Execute complex, multistep browser workflows

By combining AI models with reliable cloud browser execution, organizations can build agents that automate browser tasks that traditionally required human interaction. To learn more, see [Browser Automation Tool in Microsoft Foundry](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/browser-automation?tabs=prompt-agents&pivots=python).

### Remote MCP server

Playwright Workspaces includes a remote Model Context Protocol (MCP) server that enables AI tools and agents to interact with managed cloud browsers.

The remote MCP server provides a secure and scalable interface between AI systems and browser execution environments.
You can connect Playwright Workspaces to compatible MCP clients and agent platforms, enabling scenarios such as:
- Agentic browser automation
- Intelligent web navigation
- Browser-assisted copilots
- Information retrieval workflows
- Human-in-the-loop automation

By using the remote MCP server, your organization can centralize browser infrastructure while enabling multiple AI tools and agents to access cloud browsers through a consistent interface. To learn more, see [Playwright Workspaces remote MCP](./how-to-playwright-workspaces-remote-mcp.md).

## Core capabilities

### Playwright-native execution

Playwright Workspaces works seamlessly with existing Playwright applications and workflows. Run Playwright tests by using the Playwright Test Runner or connect directly to cloud browsers through the Chrome DevTools Protocol (CDP). Whether you're executing end-to-end tests, browser automation scripts, or AI-driven workflows, you can use the same Playwright APIs and tooling that developers already know and use today.

### Cross-browser and cross-platform testing

Validate application experiences across multiple browser and operating system combinations without managing browser infrastructure. Playwright Workspaces provides cloud-hosted browser environments that help teams verify functionality, compatibility, and user experiences across supported browser and OS configurations at scale.

### Secure access to private applications

Test and automate applications that aren't publicly accessible. Playwright Workspaces supports connectivity to private websites and internal applications, enabling browser execution against development, staging, and enterprise environments while maintaining organizational security requirements and network controls.

### Built-in observability and browser session data

Gain visibility into browser executions with rich diagnostic artifacts and session data. Playwright Workspaces captures information that helps teams understand test failures, investigate automation issues, and analyze browser behavior. Access execution artifacts, logs, traces, screenshots, recordings, and browser session data to accelerate troubleshooting and improve reliability.

### Live browser view and Take Control

Observe browser activity in real time through Live View. When troubleshooting a test or automation workflow, you can connect to an active browser session to see exactly what is happening as it executes. For deeper investigation, Take Control enables you to interact directly with the running browser, helping you reproduce issues, validate fixes, and debug complex workflows more efficiently.

### Enterprise authentication and access control

Playwright Workspaces integrates with Microsoft Entra ID to provide secure, enterprise-grade authentication and authorization. Users can access workspace resources using their organizational identities, while automation workflows and integrations can authenticate using access tokens where appropriate. This approach enables secure access management, governance, and integration with existing enterprise security policies.

## Architecture

The following diagram illustrates how Playwright Workspaces provides cloud browser infrastructure for different workloads:

:::image type="content" source="./media/overview-what-is-microsoft-playwright-workspaces/playwright-workspaces-architecture.png" alt-text="Diagram that shows an architecture overview of Playwright Workspaces." lightbox="./media/overview-what-is-microsoft-playwright-workspaces/playwright-workspaces-architecture-overview.png":::

## In-region data residency and data at rest

Playwright Workspaces doesn't store or process customer data outside the region you deploy the workspace in. When you use the regional affinity feature, the metadata is transferred from the cloud hosted browser region to the workspace region in a secure and compliant manner.

Playwright Workspaces automatically encrypts all data stored in your workspace with keys managed by Microsoft (service-managed keys). For example, this data includes workspace details, Playwright test run metadata like test start and end time, test minutes, who ran the test, and test results which are published to the service.

## Related content

- [Quickstart: Run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
- [Quickstart: Automate browser tasks](./quickstart-automate-browser-tasks-remote-mcp.md)
