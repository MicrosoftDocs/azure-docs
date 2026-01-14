---
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  include
ms.date: 05/08/2024
ms.author: cshoe
---

| Item | Explanation |
|---|---|
| Scope | Components run in the same environment as the connected container app. |
| Scaling | Components can't scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| Resources | The container resource allocation for components is fixed. The number of CPU cores is 0.5, and the memory size is 1 GB. |
| Pricing | Component billing falls under consumption-based pricing. Resources consumed by managed components are billed at the active or idle rates, depending on resource usage. You can delete components that are no longer in use to stop billing. |
| Binding | Container apps connect to a component via a binding. The bindings inject configurations into container app environment variables. After a binding is established, the container app can read the configuration values from environment variables and connect to the component. |
