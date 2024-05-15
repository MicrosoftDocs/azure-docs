---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 03/12/2024
ms.author: sgilley
---


# [Labeling team lead](#tab/team-lead)

The labeling team lead allows you to review and reject the labeled dataset and view labeling insights. In addition to it, this role also allows you to perform the role of a labeler.

*labeling_team_lead_custom_role.json* :

```json
{
    "Name": "Labeling Team Lead",
    "IsCustom": true,
    "Description": "Team lead for Labeling Projects",
    "Actions": [
        "Microsoft.MachineLearningServices/workspaces/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/write",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/update/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read"
    ],
    "NotActions": [
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/write",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/delete",
        "Microsoft.MachineLearningServices/workspaces/labeling/export/action"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscriptionId>"
    ]
}
```

# [Vendor account manager](#tab/vendor-admin)

A vendor account manager can help manage all the vendor roles and perform any labeling action. They can't modify projects or view MLAssist experiments.

*vendor_admin_role.json* :

```json
{
    "Name": "Vendor account admin",
    "IsCustom": true,
    "Description": "Vendor account admin for Labeling Projects",
    "Actions": [
        "Microsoft.MachineLearningServices/workspaces/read", 
        "Microsoft.MachineLearningServices/workspaces/experiments/runs/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/write", 
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/update/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/approve_unapprove/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/export/action", 
        "Microsoft.MachineLearningServices/workspaces/datasets/registered/read"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscriptionId>"
    ]
}
```

# [Customer QA](#tab/customer-qa)

A customer quality assurance role can view project dashboards, preview datasets, export a labeling project, and review submitted labels. This role can't submit labels.

*customer_qa_role.json* :

```json
{
    "Name": "Customer QA",
    "IsCustom": true,
    "Description": "Customer QA for Labeling Projects",
    "Actions": [
        "Microsoft.MachineLearningServices/workspaces/read",
        "Microsoft.MachineLearningServices/workspaces/experiments/runs/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/approve_unapprove/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read",
        "Microsoft.MachineLearningServices/workspaces/labeling/export/action",
        "Microsoft.MachineLearningServices/workspaces/datasets/registered/read"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscriptionId>"
    ]
}
```

# [Vendor QA](#tab/vendor-qa)

A vendor quality assurance role can perform a customer quality assurance role, but can't preview the dataset.

*vendor_qa_role.json*:

```json
{
    "Name": "Vendor QA",
    "IsCustom": true,
    "Description": "Vendor QA for Labeling Projects",
    "Actions": [
        "Microsoft.MachineLearningServices/workspaces/read", 
        "Microsoft.MachineLearningServices/workspaces/experiments/runs/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/update/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/labels/approve_unapprove/action",
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read", 
        "Microsoft.MachineLearningServices/workspaces/labeling/export/action"
    ],
    "AssignableScopes": [
        "/subscriptions/<subscriptionId>"
    ]
}
```

---