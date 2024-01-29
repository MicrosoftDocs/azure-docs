---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project with Git.

[!INCLUDE [prepare-spring-project-event-driven](prepare-spring-project-git-event-driven.md)]

-->

1. The sample project is ready on GitHub. Clone the sample project by using the following command:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
   ```

1. Build the sample project by using the following commands:

   ```bash
   cd ASA-Samples-Event-Driven-Application
   ./mvnw clean package
   ```
