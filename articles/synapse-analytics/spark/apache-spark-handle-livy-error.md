---
title: Handle Livy errors on Apache Spark in Synapse
description: Guide on how to handle and interpret job failures on Apache Spark in Synapse Analytics.
author: Niharikadutta
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 06/16/2022
ms.author: nidutta
---

# Failing Spark jobs in Synapse Analytics

Sometimes an application on Spark fails due to various reasons. These reasons could be system or user related, and debugging these errors involves significant effort from the user and supoprt engineer to identify the root cause and resolution. Until recently all failures in Spark jobs on Synapse are surfaced to the user in the monitoring pane with the generic error code LIVY_JOB_STATE_DEAD. 
// TODO: insert screen shot here (??? What workspace to use for demo screenshots?)

This error code gives no further insight into the failing job and requires digging into the driver, executor , spark event and livy logs to identify the real cause of failure. To make this easier, we have introduced a new feature inside Synapse that aims to make this process a little easier by replacing the generic error code by a more precise error code that describes the cause of failure alongwith steps that can be taken to fix the issue.

# Introducing New Error codes in Synapse

This new feature does the heavy lifting of parsing and checking the logs on the backend to identify the root cause and display it to the user on the monitoring pane along with the steps to take to resolve the issue.
// TODO: screenshot with new errors and tsg

Here is the list of all error types we support today. Please note, we are continuously refining and adding to these error codes by improving our model.

## Currently supported error codes in Synapse

// TODO: add all error codes and their corresponding TSG here

Note: If you have built any tooling around Synapse job monitoring that checks for a failing job by checking against the error code LIVY_JOB_STATE_DEAD, that would no longer work as the returned error codes would be different as mentioned above. Please modify any scripts accordingly.
