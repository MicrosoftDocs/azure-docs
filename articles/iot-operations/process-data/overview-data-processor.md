---
title: Process messages at the edge or in the cloud
description: Use the Azure IoT Operations Data Processor to aggregate, enrich, normalize, and filter the data from your devices before it's sent for storage or analysis.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: conceptual #Required.
ms.date: 09/08/2023
---

<!--
Remove all the comments in this template before you sign off or merge to the main branch.

This template provides the basic structure of a Feature availability article pattern. See the
[instructions - Feature availability](../level4/article-feature-availability.md) in the pattern
library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

-->

<!-- 1. H1 ------------------------------------------------------------------------------

Required: Use an H1 that includes the feature name and the product or service name.

-->

# Use the Data Processor Preview in Azure IoT Operations – enabled by Azure Arc Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

TODO: Add your heading

<!-- 2. Overview ------------------------------------------------------------------------

Required: Lead with an overview that briefly describes what the feature does. Provide
links to more detailed information about the feature. Consider including a video or
image that provides a high-level view of how the feature works.

-->

[Overview]
TODO: Add your overview

A pipeline in data processor has an input source where data is read from, a destination where processed data is written to, and a variable number of intermediate stages to process the data.

:::image type="content" source="media/pipeline-stages.png" alt-text="Diagram that shows how a pipeline is made up from stages." border="false":::

The various intermediate stages represent the different data processing capabilities. More capabilities will be added in the future.

- You can add as many intermediate stages as you need to a pipeline.
- You can order the intermediate stages of a pipeline as you need. You can reorder stages after they're set.
- Each stage adheres to a defined implementation interface and input/output schema contract​.
- Each stage is completely independent of the other stages in the pipeline.
- All stages operate within the scope of a [partition](concept-partitioning.md), data isn't shared between different partitions.
- Data flows from one stage to the next only.

<!-- 3. Use cases -----------------------------------------------------------------------

Optional: List a few key scenarios that you can use the feature in.

-->

## Use cases
TODO: Add use cases

<!-- 4. Article body --------------------------------------------------------------------

Required: In a series of H2 sections, provide basic information about how the feature
works. Consider including:

- A *Requirements* section. List the software, networking components, tools, and
product or service versions that you need to run the feature.
- A *Considerations* section. Explain which configuration settings to use to optimize
feature performance.
- Examples. Show practical ways to use the feature, or provide code for implementing
the feature.

-->

[Article body]
TODO: Add your article body

<!-- 5. Availability and pricing information --------------------------------------------

Optional: Discuss the feature's availability and pricing.

- If the feature isn't available in all regions, provide a link to a list of supported
regions.
- If customers are charged for using the feature, provide a link to pricing information.

Don't hard-code specific regions or costs. Instead, provide links to sites that manage
and maintain that information.

--->

[Availability and pricing information]
TODO: Add your availability and pricing information

<!-- 6. Limitations ---------------------------------------------------------------------

Optional: List the feature's constraints, limitations, and known issues in an H2
section. If possible, also include the following information:

- State that upcoming releases address the known issues.
- Describe workarounds for limitations.
- Discuss the environments that the feature works best in.

Use an H2 header of *Limitations* or *Known issues.*

--->

## Limitations
TODO: Add your Limitations

<!-- 7. Next steps ----------------------------------------------------------------------

Optional: In an H2 section called *Next steps*, list resources such as the following
types of material:

- A quickstart, get-started guide, or tutorial that explains how to get started with the
feature
- An overview of the product or service that the feature's a part of
- Reference information for the feature, product, or service

--->

## Next step
TODO: Add your next steps