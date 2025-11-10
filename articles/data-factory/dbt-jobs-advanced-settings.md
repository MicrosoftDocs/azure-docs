title: dbt Jobs in Microsoft Fabric – advanced settings
description: Learn how to create and configure dbt Jobs in Microsoft Fabric.
author: vasquezd21
ms.author: vasquezd21
ms.topic: how-to
ms.date: 11/10/2025
---
# Advanced Settings


After configuring your dbt job’s Profile, click **Advanced Settings** to fine-tune execution and run behavior. The Advanced Settings panel is split into two tabs:

## General Settings

Here you can adjust project-level execution options:

- **Threads**: Set the number of parallel threads for dbt execution (e.g., `4` for medium workloads).
- **Fail fast**: If enabled, dbt will stop immediately if any resource fails to build.
- **Full refresh**: Forces dbt to rebuild all models from scratch, ignoring incremental logic.

**How to use:**
1. Click **Advanced Settings** → **General**.
2. Set the desired number of threads.
3. (Optional) Enable **Fail fast** or **Full refresh** as needed.
4. Click **Apply** to save.

<img src="images\dbtadvancedgeneral.png" />

---

##### Run Settings

This tab lets you control which models to run and how to select them:

- **Run mode**:  
  - **Run only selected models**: Choose specific models to include in the run (e.g., `orders`, `stg_customers`, etc.).
  - **Run with advanced selectors**: Use dbt selectors for granular control (unions, intersections, exclusions).
  <img src="images\dbtrunsettings1.png" width="700px" /> 

- **Advanced selector configuration**:  
  - **Selector**: Name your selector.
  - **Select**: Specify resources (models, tags, packages).
  - **Exclude**: List resources to skip.
  <img src="images\dbtrunsettings2.png" width="700px" /> 

**How to use:**
1. Click **Advanced Settings** → **Run settings**.
2. Choose your run mode:
   - For simple runs, select models from the tree.
   - For advanced runs, configure selectors for targeted execution.
3. Click **Apply** to save.

