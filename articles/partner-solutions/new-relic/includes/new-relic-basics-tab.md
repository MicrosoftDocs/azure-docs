---
author: ProfessorKendrick
ms.topic: include
ms.date: 01/10/2025
ms.author: kkendrick
---

The *Basics* tab has 3 sections:

- Project details
- Azure resource details
- New Relic account details

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Field  |Action  |
    |---------|---------|
    |Subscription    |Select a subscription from your existing subscriptions.         |
    |Resource group     |Use an existing resource group or create a new one.          |

1. Enter the values for each required setting under *Azure Resource details*.

    |Field |Action  |
    |---------|---------|
    |Resource name     |Specify a unique name for the resource.    |
    |Region     |Select a region to deploy your resource.         |

1. Enter the values for each required setting under *New Relic account details*.

    |Field  |Action  |
    |---------|---------|
    |Organization     |Choose to create a new organization, or associate your resource with an existing organization.   |

    :::image type="content" source="media/create/organization.png" alt-text="A screenshot of the Create a New Relic resource options in Azure portal . The New Relic account details **Organization** options are emphasized. ":::

    > [!NOTE]
    > 
    > If you choose to create a new organization, select **Change plan**.
    > - Available plans are displayed in the working pane. 
    > - Choose the plan you prefer, then select **Change plan**.
    > If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.