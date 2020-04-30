---
title: Plans and billing
description: Learn about plans and billing for Azure Scheduler
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: klam, estfan
ms.topic: article
ms.date: 08/18/2016
---

# Plans and billing for Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) is replacing Azure Scheduler, which is 
> [being retired](../scheduler/migrate-from-scheduler-to-logic-apps.md#retire-date). 
> To continue working with the jobs that you set up in Scheduler, please 
> [migrate to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md) as soon as possible. 
>
> Scheduler is no longer available in the Azure portal, but the [REST API](/rest/api/scheduler) 
> and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) remain available 
> at this time so that you can manage your jobs and job collections.

## Job collection plans

In Azure Scheduler, a job collection contains a specific number of jobs. The job collection is the billable entity and comes in Standard, P10 Premium, and P20 Premium plans, which are described here: 

| Job collection plan | Max jobs per collection | Max recurrence | Max job collections per subscription | Limits | 
|:--- |:--- |:--- |:--- |:--- |
| **Standard** | 50 jobs per collection | One per minute. Can't run jobs more often than one per minute. | Each Azure subscription can have up to 100 Standard job collections. | Access to Scheduler full feature set | 
| **P10 Premium** | 50 jobs per collection | One per minute. Can't run jobs more often than one per minute. | Each Azure subscription can have up to 10,000 P10 Premium job collections. For more collections, <a href="mailto:wapteams@microsoft.com">Contact us</a>. | Access to Scheduler full feature set |
| **P20 Premium** | 1000 jobs per collection | One per minute. Can't run jobs more often than one per minute. | Each Azure subscription can have up to 5,000 P20 Premium job collections. For more collections, <a href="mailto:wapteams@microsoft.com">Contact us</a>. | Access to Scheduler full feature set |
|||||| 

## Pricing

For pricing details, see [Scheduler Pricing](https://azure.microsoft.com/pricing/details/scheduler/).

## Upgrade or downgrade plans

At any time, you can upgrade or downgrade a job collection 
plan across the Standard, P10 Premium, and P20 Premium plans.

## Active status and billing

Job collections are always active unless your entire Azure subscription 
goes into a temporary disabled state due to billing issues. And although 
you can disable all jobs in a job collection through a single operation, 
this action doesn't change the job collection's billing status, so the job 
collection is *still* billed. Empty job collections are considered active 
and are billed.

To make sure a job collection isn't billed, you must delete the job collection.

## Standard billable units

A standard billable unit can have up to 10 Standard job collections. 
Since a Standard job collection can have up to 50 jobs per collection, 
one standard billing unit lets your Azure subscription have up to 500 jobs, 
or up to almost 22 *million* job executions per month. This list explains 
how you're billed based on various numbers of Standard job collections:

* If you have between 1 and 10 Standard job collections, 
you're billed for one standard billing unit. 

* If you have between 11 and 20 Standard job collections, 
you're billed for two standard billing units. 

* If you have between 21 and 30 Standard job collections, 
you're billed for three standard billing units, and so on.

## P10 premium billable units

A P10 premium billable unit can have up to 10,000 P10 Premium job collections. 
Since a P10 Premium job collection can have up to 50 jobs per collection, 
one P10 premium billing unit lets your Azure subscription have up to 500,000 jobs, 
or up to almost 22 *billion* job executions per month. 

P10 Premium job collections provide the same capabilities 
as Standard job collections but offer a price break for apps 
that require many job collections and provide more scalability. 
This list explains how you're billed based on various 
numbers of P10 Premium job collections:

* If you have between 1 and 10,000 P10 Premium job collections, 
you're billed for one P10 premium billing unit. 

* If you have between 10,001 and 20,000 P10 Premium job collections, 
you're billed for 2 P10 premium billing units, and so on.

## P20 premium billable units

A P20 premium billable unit can have up to 5,000 P20 Premium job collections. 
Since a P20 Premium job collection can have up to 1,000 jobs per job collection, 
one P20 premium billing unit lets your Azure subscription have up to 5,000,000 jobs, 
or up to almost 220 *billion* job executions per month.

P20 Premium job collections provide the same capabilities 
as P10 Premium job collections but also support a greater 
number of jobs per collection and a greater total number 
of jobs overall than P10 Premium, providing more scalability.

## Plan comparison

* If you have more than 100 Standard job collections (10 standard billing units), 
then you can get a better deal by having all job collections in a Premium plan.

* If you have one Standard job collection and one Premium job collection, 
then you're billed for one standard billing unit *and* one premium billing unit.

  The Scheduler service bills based on the number of active 
  job collections that are either standard or premium.

## Next steps

* [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
* [Azure Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)