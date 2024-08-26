---
title: What is Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: Azure Machine Learning prompt flow is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs).
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: conceptual
author: lgayhardt
ms.author: lagayhar
ms.reviewer: yozen
ms.date: 08/25/2024
---

# What is Azure Machine Learning prompt flow

Azure Machine Learning prompt flow is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). Prompt flow provides a comprehensive solution that simplifies the process of prototyping, experimenting, iterating, and deploying your AI applications.

With Azure Machine Learning prompt flow, you're able to:

- Create executable flows that link LLMs, prompts, and Python tools through a visualized graph.
- Debug, share, and iterate your flows with ease through team collaboration.
- Create prompt variants and evaluate their performance through large-scale testing.
- Deploy a real-time endpoint that unlocks the full power of LLMs for your application.

Azure Machine Learning prompt flow offers a versatile, intuitive way to streamline your LLM-based AI development.

## Benefits of using Azure Machine Learning prompt flow

Azure Machine Learning prompt flow offers a range of benefits that help users transition from ideation to experimentation and, ultimately, production-ready LLM-based applications:

### Prompt engineering agility

- Interactive authoring experience: Visual representation of the flow's structure, allowing users to easily understand and navigate their projects. It also offers a notebook-like coding experience for efficient flow development and debugging.
- Variants for prompt tuning: Users can create and compare multiple prompt variants, facilitating an iterative refinement process.
- Evaluation: Built-in evaluation flows enable users to assess the quality and effectiveness of their prompts and flows.
- Comprehensive resources: Access a library of built-in tools, samples, and templates that serve as a starting point for development, inspiring creativity, and accelerating the process.

### Enterprise readiness for LLM-based applications

- Collaboration: Supports team collaboration, allowing multiple users to work together on prompt engineering projects, share knowledge, and maintain version control.
- All-in-one platform: Streamlines the entire prompt engineering process, from development and evaluation to deployment and monitoring. Users can effortlessly deploy their flows as Azure Machine Learning endpoints and monitor their performance in real-time, ensuring optimal operation and continuous improvement.
- Azure Machine Learning Enterprise Readiness Solutions: Prompt flow uses Azure Machine Learning's robust enterprise readiness solutions, providing a secure, scalable, and reliable foundation for the development, experimentation, and deployment of flows.

Azure Machine Learning prompt flow empowers agile prompt engineering, seamless collaboration, and robust enterprise LLM-based application development and deployment.

## LLM-based application development lifecycle

Azure Machine Learning prompt flow streamlines AI application development, taking you through developing, testing, tuning, and deploying flows to build complete AI applications.

The lifecycle consists of the following stages:

- Initialization: Identify the business use case, collect sample data, learn to build a basic prompt, and develop a flow that extends its capabilities.
- Experimentation: Run the flow against sample data, evaluate the prompt's performance, and iterate on the flow if necessary. Continuously experiment until satisfied with the results.
- Evaluation & Refinement: Assess the flow's performance by running it against a larger dataset, evaluate the prompt's effectiveness, and refine as needed. Proceed to the next stage if the results meet the desired criteria.
- Production: Optimize the flow for efficiency and effectiveness, deploy it, monitor performance in a production environment, and gather usage data and feedback. Use this information to improve the flow and contribute to earlier stages for further iterations.

With prompt flow's methodical process, you can develop, test, refine, and deploy sophisticated AI applications confidently.

:::image type="content" source="./media/overview-what-is-prompt-flow/prompt-flow-lifecycle.png" alt-text="Diagram of the prompt flow lifecycle starting from initialization to experimentation then evaluation and refinement and finally production. " lightbox = "./media/overview-what-is-prompt-flow/prompt-flow-lifecycle.png":::

## Next steps

- [Get started with prompt flow](get-started-prompt-flow.md)
