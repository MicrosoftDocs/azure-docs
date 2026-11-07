---
author: dominicbetts
ms.author: dobett
ms.date: 09/16/2026
ms.topic: include
ms.service: azure-iot
ms.custom: include file
---

<!--
PNG generation: First render the Mermaid source to a temporary PNG with
`npx --yes @mermaid-js/mermaid-cli`. Then resize that PNG to 1176 pixels wide
with `npx --yes sharp-cli` to meet the 1000-1200 pixel lightbox guidance while
preserving Mermaid's HTML labels. Direct SVG rasterization omits those labels.
The arrowheads in the source below are HTML-escaped to keep this comment intact;
replace each `&gt;` with `>` before rendering.

Mermaid source:

%%{init: {
    "theme": "base",
    "fontFamily": "Segoe UI, Arial, sans-serif",
    "flowchart": {
        "curve": "linear",
        "htmlLabels": true,
        "nodeSpacing": 48,
        "rankSpacing": 64
    },
    "themeVariables": {
        "background": "#ffffff",
        "primaryColor": "#deecf9",
        "primaryTextColor": "#242424",
        "primaryBorderColor": "#0078d4",
        "lineColor": "#605e5c",
        "clusterBkg": "#f5f5f5",
        "clusterBorder": "#8a8886",
        "edgeLabelBackground": "#ffffff",
        "fontSize": "16px"
    }
}}%%
flowchart LR
    subgraph namespace["Azure Device Registry namespace"]
        direction LR

        groupA["Group of devices<br/>Query-defined set of IoT Hub-connected devices"]

        standardJob["Software update job"]
        onboardingJob["Onboarding update job"]

        standardJob --&gt;|"Targets"| groupA

        onboardingJob --&gt;|"Targets namespace directly"| namespaceTarget["Devices being onboarded"]
    end

    classDef job fill:#deecf9,stroke:#0078d4,color:#242424,stroke-width:2px
    classDef group fill:#dff6dd,stroke:#107c10,color:#242424,stroke-width:2px
    classDef device fill:#fff4ce,stroke:#8a6d00,color:#242424,stroke-width:2px

    class standardJob,onboardingJob job
    class groupA group
    class namespaceTarget device

    style namespace fill:#f5f5f5,stroke:#8a8886,stroke-width:1px,color:#242424
    linkStyle default stroke:#605e5c,stroke-width:2px
-->

:::image type="content" source="../media/groups-jobs-software-updates/groups-jobs-software-updates.svg" alt-text="Diagram showing a software update job targeting a group of devices and an onboarding update job targeting devices being onboarded within an Azure Device Registry namespace." lightbox="../media/groups-jobs-software-updates/groups-jobs-software-updates-expanded.png" border="false":::