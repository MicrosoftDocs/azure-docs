---
title: "include file"
description: "include file"
services: machine-learning
author: blackmist
ms.service: machine-learning
ms.author: larryfr
ms.custom: "include file"
ms.topic: "include"
ms.date: 07/26/2023
---

> [!IMPORTANT]
> The following expressions are resolved on the _server_ side, not the _client_ side. For scheduled jobs where the job _creation time_ and job _submission time_ are different, the expressions are resolved when the job is submitted. Since these expressions are resolved on the server side, they use the _current_ state of the workspace, not the state of the workspace when the scheduled job was created. For example, if you change the default datastore of the workspace after you create a scheduled job, the expression `${{default_datastore}}` is resolved to the new default datastore, not the default datastore when the scheduled job was created.

| Expression | Description | Scope |
| --- | --- | --- |
| `${{default_datastore}}` | If pipeline default datastore is configured, is resolved as pipeline default datastore name; otherwise is resolved as workspace default datastore name. <br><br> Pipeline default datastore can be controlled using `pipeline_job.settings.default_datastore`. | Works for all jobs. <br><br> Pipeline jobs have a configurable pipeline default datastore. | 
| `${{name}}` | The job name. For pipelines, it's the step job name, not the pipeline job name. | Works for all jobs |
| `${{output_name}}` | The job output name | Works for all jobs |

For example, if `azureml://datastores/${{default_datastore}}/paths/{{$name}}/${{output_name}}` is used as the output path, at runtime it's resolved as a path of `azureml://datastores/workspaceblobstore/paths/<job-name>/model_path`.