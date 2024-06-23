---
title: Distributed data structures
description: Distributed data structures are the building blocks of Fluid applications
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/data-structures/overview/
---

# Distributed data structures

The Fluid Framework provides developers with distributed data structures (DDSes) that automatically ensure that each connected client has access to the same state. The APIs provided by DDSes are designed to be familiar to programmers who've used common data structures before.

> [!NOTE]
> This article assumes that you are familiar with
> [Introducing distributed data structures](https://fluidframework.com/docs/build/dds/) on fluidframework.com.

A distributed data structure behaves like a local data structure. Your code can add data to it, remove data, update it, etc. However, a DDS is not a local object. A DDS can also be changed by other clients that expose the same parent container of the DDS. Because users can simultaneously change the same DDS, you need to consider which DDS to use for modeling your data.

> [!NOTE]
> **Meaning of 'simultaneously'**
>
> Two or more clients are said to make a change *simultaneously* if they each make a change before they have received the
> others' changes from the server.

Choosing the correct data structure for your scenario can improve the performance and code structure of your application.

DDSes vary from each other by three characteristics:

- **Basic data structure**: For example, key-value pair, a sequence, or a queue.
- **Client autonomy**: An *optimistic* DDS enables any client to unilaterally change a value and the new value is relayed to all other clients. But a *consensus* DDS only allows a change if it is accepted by other clients by a consensus process.
- **Merge policy**: The policy that determines how conflicting changes from clients are resolved.

Below we've enumerated the data structures and described when they may be most useful.

## Key-value data

These DDSes are used for storing key-value data. They are optimistic and use a last-writer-wins merge policy. Although the value of a pair can be a complex object, the value of any given pair cannot be edited directly; the entire value must be replaced with a new value containing the desired edits, whole-for-whole.

- **SharedMap**: a basic key-value data structure.

### Key-value scenarios

Key-value data structures are the most common choice for many scenarios.

- User preference data.
- Current state of a survey.
- The configuration of a view.

### Common issues and best practices for key-value DDSes

- Storing a counter in a SharedMap will have unexpected behavior. Use the SharedCounter instead.
- Storing arrays, lists, or logs in a key-value entry may lead to unexpected behavior because users can't collaboratively modify parts of one entry. Try storing the array or list data in a SharedSequence or SharedInk.
- Storing a lot of data in one key-value entry may cause performance or merge issues. Each update will update the entire value rather than merging two updates. Try splitting the data across multiple keys.

## Sequences

These DDSes are used for storing sequential data. They are optimistic. Sequence data structures are useful when you'll need to add or remove data at a specified index in a list or array. Unlike the key-value data structures, sequences have a sequential order and can handle simultaneous inserts from multiple users.

- **SharedNumberSequence**: a sequence of numbers.
- **SharedObjectSequence**: a sequence of plain objects.

### Sequence scenarios

- Lists
- Timelines

### Common issues and best practices for sequence DDSes

- Store only immutable data as an item in a sequence. The only way to change the value of an item is to first remove it from the sequence and then insert a new value at the position where the old value was. But because other clients can insert and remove, there's no reliable way of getting the new value into the desired position.

## Strings

The SharedString DDS is used for unstructured text data that can be collaboratively edited. It is optimistic.

- `SharedString` -- a data structure for handling collaborative text.

### String scenarios

- Text editors

## See also

To learn more about DDSes and how to use them, see the following sections of fluidframework.com:

- [Introducing distributed data structures](https://fluidframework.com/docs/build/dds/).
- [Types of distributed data structures](https://fluidframework.com/docs/data-structures/overview/).
