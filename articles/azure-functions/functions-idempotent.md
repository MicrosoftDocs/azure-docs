---
title: Designing Azure Functions for identical input
description: Building Azure Functions to be idempotent
author: craigshoemaker
ms.author: cshoe
ms.date: 9/12/2019
ms.topic: article
---

# Designing Azure Functions for identical input

The reality of event-driven and message-based architecture dictates the need to accept identical requests while preserving data integrity and system stability.

To illustrate, consider an elevator call button. As you press the button, it lights up and an elevator is sent to your floor. A few moments later, someone else joins you in the lobby. This person smiles at you and presses the illuminated button a second time. You smile back and chuckle to yourself as you're reminded that the command to call an elevator is idempotent.

Pressing an elevator call button a second, third, or fourth time has no bearing on the final result. When you press the button, regardless of the number of times, the elevator is sent to your floor. Idempotent systems, like the elevator, result in the same outcome no matter how many times identical commands are issued.

When it comes to building applications, consider the following scenarios:

- What happens if your inventory control application tries to delete the same product more than once?
- How does your human resource application behave if there is more than one request to create an employee record for the same person?
- Where does the money go if your banking app gets 100 requests to make the same withdrawal?

There are many contexts where requests to a function may receive identical commands. Some situations include:

- Retry policies sending the same request many times
- Cached commands replayed to the application
- Application errors sending multiple identical requests

To protect data integrity and system health, an idempotent application contains logic that may contain the following behaviors:

- Verifying of the existence of data before trying to execute a delete
- Checking to see if data already exists before trying to execute a create action
- Reconciling logic that creates eventual consistency in data
- Concurrency controls
- Duplication detection
- Data freshness validation
- Guard logic to verify input data

Ultimately idempotency is achieved by ensuring a given action is possible and is only executed once.
