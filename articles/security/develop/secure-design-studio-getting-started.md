---
title: Get started with SecureDesignStudio
description: Run SecureDesignStudio locally, create a first security and privacy model, review it, and save your work.
author: simorjay
ms.author: frasim
ms.service: security
ms.subservice: security-develop
ms.topic: quickstart
ms.date: 11/24/2026
#customer intent: As a developer or architect, I want to create and review a first model in SecureDesignStudio so that I can document security and privacy design decisions.
---

# Get started with SecureDesignStudio

SecureDesignStudio (SDS) is an open-source, browser-based tool for Windows, macOS, and Linux. It helps you describe a system, review its security and privacy design, and record follow-up work. In this quickstart, you run SDS locally and create a simple model.

SDS supports Microsoft and non-Microsoft designs. This example uses Azure service types from the catalog, but you can use generic components instead.

The screenshots use the fictional **Submit an order** example. Its authentication and data choices illustrate the controls, not requirements for your system. These reference images show SDS 1.0.18 on Windows, so current controls might differ.

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js 24 LTS](https://nodejs.org/en/download), which includes npm
- A current version of Microsoft Edge or Google Chrome
- Internet access for the initial installation

You don't need an Azure account or AI service for this quickstart. On macOS and Linux, use a Node.js version manager such as [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), or install Node.js through your organization's approved process. Verify `git --version`, `node --version`, and `npm --version` in Terminal before continuing. On Windows, use `npm.cmd --version` if PowerShell blocks the npm script wrapper. Node.js should report `v24.x.x`.

## Start SDS

For current setup guidance, see [aka.ms/securedesignstudio](https://aka.ms/securedesignstudio).

The commands clone the latest source from the project's `main` branch instead of pinning an older commit. An existing local installation doesn't update automatically. The screenshots show an earlier version, so current controls might differ. The project doesn't currently publish tagged releases, and the source isn't a Microsoft-supported product release. For maintenance and issue reporting, see [Open-source support](threat-modeling-tool.md#open-source-support).

### Windows

Open PowerShell in the folder where you want to keep the app. Run each command in order, continuing only if it succeeds:

```powershell
git clone https://github.com/microsoft/SecureDesignStudio.git
Set-Location .\SecureDesignStudio
.\Start-SecureDesignStudio.ps1
```

If PowerShell blocks the launcher, run `npm.cmd ci` and then `npm.cmd run dev` from the same app folder instead. Don't weaken your execution policy.

### macOS or Linux

Open Terminal and run each command in order, continuing only if it succeeds:

```sh
git clone https://github.com/microsoft/SecureDesignStudio.git
cd SecureDesignStudio
sh ./start-securedesignstudio.sh
```

Using `sh` avoids requiring an executable permission on the downloaded shell script. You can also run `npm run start` from the app folder on any of these operating systems. It uses the shared prerequisite-checking launcher. Neither macOS nor Linux requires PowerShell.

### Open the local app

The launchers check Node.js/npm and port 5173, install dependencies on first run, repair missing or incompatible direct dependencies, and start the local server. Initial installation requires internet access.

Open **http://localhost:5173/** in your browser. Keep the terminal open while you work; press **Ctrl+C** in that terminal to stop the server. If port 5173 is busy, stop your own previous SDS server or coordinate with its owner.

This local mode keeps collaboration and AI disabled. After installation and the initial page load, core editing, analysis, and local file operations work offline.

## Create a scenario

A **scenario** describes one workflow within your system.

On **Create your first scenario**, enter `Submit an order` and select **Create**. If you already have a model open, use **Model** > **New scenario** to add a workflow without replacing your work.

:::image type="content" source="media/secure-design-studio/create-scenario.png" alt-text="Screenshot of Create your first scenario, with Submit an order entered as the title and the Create button available." lightbox="media/secure-design-studio/create-scenario.png":::

## Draw the workflow

1. Right-click the blank canvas and select **New Node**. Repeat to create three components.
2. Select each node and use the **Properties** inspector to name them `Web app`, `Order API`, and `Order store`. Choose a suitable service type from the catalog. Use the **Data Store** DFD role for Order store.
3. Drag between node handles to connect **Web app to Order API**, then **Order API to Order store**.
4. Select each flow and name it `Submit order` or `Store order`.
5. Right-click the canvas and select **New Security Boundary**. Name it and resize it around the components that share that security perimeter.

The arrow shows the call direction. A boundary describes intended separation; it doesn't configure or enforce it.

:::image type="content" source="media/secure-design-studio/diagram.png" alt-text="Screenshot of the Submit an order diagram, showing Web app connected to Order API and Order store, with an Order service security boundary around the API and store." lightbox="media/secure-design-studio/diagram.png":::

*The example diagram after adding the authentication and data details described next.*

## Describe security and privacy

Select each flow and record its authentication in **General / Security**. Capture the intended mechanism; leave unknown details for review rather than inventing them.

Choose **Model** > **Data Elements** > **Add data item**. Create an `Order details` item and select the classification appropriate to your design. Use synthetic examples, not real customer data.

On each flow's **Privacy** tab, attach the item under **Data in request**. Use **Data in response** for information returned to the caller.

:::image type="content" source="media/secure-design-studio/flow-data.png" alt-text="Screenshot of the flow's Privacy tab, with Order details attached under Data in request and a separate Data in response section." lightbox="media/secure-design-studio/flow-data.png":::

## Analyze and review

Choose **Review** > **Analyze**. SDS checks the whole document for missing information and policy inconsistencies. In each scenario, it propagates request data to receiving nodes and response data to calling nodes for retention review.

Select the receiving nodes and complete their **Privacy** retention entries for this scenario. Analyze again, then use **Review** > **Issues** to inspect findings. Record questions in **Review** > **Comments** and follow-up actions in **Model** > **Work Items**.

:::image type="content" source="media/secure-design-studio/analyze-issues.png" alt-text="Screenshot of the Issues inspector, showing findings for missing data retention on Order store and a missing production identity on Submit order." lightbox="media/secure-design-studio/analyze-issues.png":::

*This example deliberately leaves retention and a production identity incomplete to show how findings appear.*

Walk through the design with a colleague. Optionally choose **View** > **Sequence** to explain the order of calls.

> [!NOTE]
> Analyze checks the model, not your deployed system. If Analyze reports no findings, that doesn't mean the design is secure or the review is complete. Validate mitigations against the implementation.

## Save and share

Choose **File** > **Save as** > **SecureDesignStudio model (.tma)** and save `submit-an-order.tma`. Use **File** > **Open** to reopen it.

:::image type="content" source="media/secure-design-studio/save-model.png" alt-text="Screenshot of the Save as dialog, with submit-an-order.tma entered as the file name." lightbox="media/secure-design-studio/save-model.png":::

**Autosave is recovery, not backup.** Keep a saved `.tma` file in an approved location. To share a readable summary of the selected scenario, choose **Export** > **Review report (.html)**.

## Start from an existing TMT diagram

Save any current SDS work first. Choose **File** > **Import** > **Threat Modeling Tool (.tm7)**, select your file, and review the conversion summary before replacing the current model.

Keep the original `.tm7` file. Import doesn't preserve every template property or native threat record. Review the converted diagram, and save a separate `.tma` copy.

## Next steps

- Explore the [SecureDesignStudio feature overview](secure-design-studio-feature-overview.md), or open a [synthetic sample model](https://github.com/microsoft/SecureDesignStudio/blob/main/samples/README.md) with **File** > **Open**.
- For optional AI-assisted design and review, follow [Bring your own AI](https://github.com/microsoft/SecureDesignStudio/blob/main/docs/bring-your-own-ai.md). Choose Azure OpenAI in Microsoft Foundry Models, Claude Code, or Codex only when your organization approves the provider and the data you plan to send. None is required for this quickstart.
- To continue with TMT instead, use the [TMT getting-started guide](threat-modeling-tool-getting-started.md).
