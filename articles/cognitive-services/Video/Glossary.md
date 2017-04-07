---
title: Glossary for Video API in Microsoft Cognitive Services | Microsoft Docs
description: Get definitions of key terms used in the Video API in Cognitive Services.
services: cognitive-services
author: CYokel
manager: ytkuo

ms.service: cognitive-services
ms.technology: video
ms.topic: article
ms.date: 05/23/2016
ms.author: chbryant
---

# Glossary

## A

## B

## C

## D

### Duration

The length of the fragment, in ticks (within the JSON result).

## E

### Events

An array of events (within the JSON result). The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time. 

## F

### Face Detection/Tracking

This is derived from the video face detection and tracking results (this is different from the Face API’s Face ID). This is the index of a face. A given individual should have the same ID throughout the overall video. Due to limitations in the detection algorithm (e.g. occlusion) this cannot be guaranteed.

### Fragments

The JSON metadata is chunked up into different segments called fragments. Each fragment contains a start, duration, interval number, and event(s). 

### Framerate

Frames per second of the video.

## G

## H


## I

### Interval

The length of each event within the fragment, in ticks (within the JSON result).


## J

## K

## L

## M

### Motion Detection

Motion detection is the action of detecting motion in a video.

## N


## O

### Offset

This is the time offset for timestamps (within the JSON result). In version 1.0 of Video APIs, this will always be 0. In future scenarios we support, this value may change.


## P


## Q

## R

### Region of Interest

This is derived from the motion detection JSON results. Regions refers to the area in your video where you care about motion.  

## S

### Sensitivity 

User can specify ‘sensitivity level’ for motion detection, which are high, medium, and low, default is medium. Higher sensitivity means more motions will be detected at a cost that more false alarms will be reported.

### Stabilization

Stabilization takes a shaky video and smooths and stabilizes it.

### Start

The start time of the first event, in ticks (within the JSON result).

### Subscription key

Subscription key is a string that you need to specify as a query string parameter in order to invoke any Face API. The subscription key can be found in My Subscriptions page after you sign in the Microsoft Cognitive Services portal. There will be two keys associated with each subscription: one primary key and one secondary key. Both can be used to invoke API identically. You need to keep the subscription keys secure, and you can regenerate subscription keys at any time from My Subscriptions page as well. 

## T

### Timescale

The “ticks” per second of the video (within the JSON result).

### Type

This is derived from the motion detection JSON results.  2 refers to motion, 4 refers to light change. 

## U

## V

### Video API

Video API is a cloud-based API that provides the most advanced algorithms for stabilization, face detection and tracking, and motion detection in video. 

## W

## X

## Y

## Z

 * [Link back to Overview](Home.md)
 * [Link back to Get Started with Video API](GetStarted.md)
 * [Link back to How to Call Video API](./How-To/HowtoCallVideoAPIs.md)
