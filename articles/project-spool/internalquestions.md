*Note: This is a temporary page.  **This will not be published.***

## Internal Questions

### Content Strategy Questions


- {mick} **Would you prefer to keep meta-documentation here, or in our OneNote?**

> Collaboration = OneNote.  Markdown with review = md in source 

- {mick} Our [Azure Content Contributor's Guide](https://review.docs.microsoft.com/en-us/help/contribute/contribute-get-started-mvc?branch=master) recommends starting out with 10-15 use-cases.  **What are those use-cases?**  Some ideas:
  - Send and receive MMS/SMS text messages.
  - Make and receive voice calls to phone numbers through PSTNs.
  - **Make and receive voice calls to phone numbers through VOIP**
  - Make and receive voice calls to any device without a phone number.
  - **Build real-time chat into your application.**
  - **Let your users participate in group [calls, text messages, and web chats].** (group calls are priority)
  - **Broadcast messages to a group of devices.**
  - **Add web video chat into your app.** (this is a priority as well)
  - Add web video chat (across NATs / firewalls) into your app.
  - Send push notifications to Android and iOS devices. (not being provided directly - but sample would be nice)
  - **Send media files to devices.**
  - **Let your users share their screens.**
  - Route your business phone number to a bot
  - Eventually – message directly to Twitter, Whatsapp, Facebook, and others.

> Wave 1/2/3 - describes feature rollout.
> Web VOIP / TURN / STUN / SIGNALING
> PSTN / SMS come later 

> for markdown... "Markdown all in one", "preview enhanced"

> We're shipping two SDKs - low-level configurable services, and high-level.  "Which is right for me?"
> We don't have assets for this quite yet... we need to formalize this some more.  Private preview is this week and coming weeks.

- {mick} **Who is our "early adopter" and what scenarios would appeal to them?**

> MSFT faithful - canonical first customer is already in Azure, already in MSFT ecosystem, maybe already using something like Twilio.  Consolidation of billing is one segment.  .NET / JS.

> A lot of our customers actually spin up their own TURN / STUN.

> "by the way, you can leverage our stuff - copy paste this for your TURN configuration" 

- {mick} **What Spool capabilities do our users *have* to have?  Should I focus on building out docs to support those?**
  - Question Context: I'm tempted to apply some of the lessons I've learned from my entrepreneurial endeavors as we craft our content.  One of those lessons is to deliver a crisp, minimal painkiller - something that alleviates so much pain with so much clarity that our users would be *very* disappointed if our solution didn't exist.  This is related to some of the things I've learned about product-market fit - specifically, [the 40% rule](https://uxplanet.org/understanding-product-market-fit-from-start-to-finish-596a4653814). 

> Three categories of customers - 1) already deployed RTC solution, it sucks, they go from telemedicine to RTC shop and they're stuck.  They're easy to find.  They want Azure to do the heavy lifting.  2) We know we need to add RTC to our offering, but we don't know what option is best - is Azure an option?  These are people who have an app who need to add voice/video - what's the best way to do that?  1) wants to take our infrastructure, 2) is curious about augmenting their solution with our features VERY easily - demo it in 15 minutes to the CTO.  Enable 2) to do this.  This is a key message - it's easy.  Customer 3) - they don't know they have a problem yet.  This is a marketing message.  Video and voice are the future - and here's how you jump on board.  Sales would leverage this story as a separate marketing motion - closer to GA.

> 1) is sharpest pain - private preview folks are here.  1/2 may be equal.

- {mick} **Do we have a "showcase app" that we can integrate with our docs and demos?**

> Samples directory in the repo 

- {mick} **As we build our docs, should we build a corresponding collection of "building block samples" like this that utilizes a prepaid Nexus**?  
  - When I built my home security app, I primarily depended upon [this resource](https://webrtc.github.io/samples/) to learn WebRTC.  This gave me "building block" samples that I could combine without depending too much on documentation.  I'm envisioning something very similar to the WebRTC samples app - a minimal, interactive, usable, sharable, plug-and-playable collection of building blocks that link back to the docs.

> We're looking into a developer sandbox that we can use to play around with it - we can look at this later - towards / after GA.  "Try it" button to demo the spool APIs but we might need something heavier weight.  Not a priority though.

- It seems that WebRTC + SignalR empower highly technical devs to roll out a lot of our scenarios, right now.  But there’s a high technical barrier to entry... **is the Spool clientside SDK being built to reduce this barrier to entry, or is it primarily to drive Azure consumption via Spool's serverside offerings**?
  - **Is our business model focused on empowering less experienced devs with our SDKs, and then monetizing *after* we’ve empowered?  Or are we directly targeting the monetizable NAT traversal / telephony needs from the outset?** 

> "Spool" - it's 100% about driving meters in Azure.  The SDKs don't work without Azure.  Azure is the priority here.  BUT - we also own WebRTC on windows - this will expand to the microsoft-blessed IOS/Android WebRTC SDKs.  We have a sort of "blessed version" of Windows WebRTC - this could be coming for Android / iOS as well in the future.  We have this separate topic - MSFT's WEBRTC story - what are they bringing to the table to improve the tech.  This will be in a few months.

- {mick} **Should I connect with our Marketing team to ensure that our stories and language are aligned?**

> TBD - ACOM - owns azure.com - they'll write guidance - the ACOM team implements it.  The seam between Marketing content and docs is pretty vague.  And on the portal - we can start that conversation soon.  We may end up just leveraging ACOM assets.

- {mick} **Should I be concerned with capturing feedback from alpha/beta users?**  If so, how do I access them, and what protocol should I follow?  

> Yes!  Join private preview.  https://microsoft.qualtrics.com/jfe/form/SV_2tpYiqQcHLqUk7j
> Lurk in teams channel.  A lot of correspondence will happen in a github channel - but the process is still being ironed out.  Right now it's just through teams.  For PP - 10 of them are high-pri customers.  Everyone else will be self-service.  Feel free to ping those PMs who are supporting the high-pris and then reach out to customers - what types of docs would you want?  What scenarios do they want to see support for?

> Docs will go public at public preview, before GA.

- {mick}  **Do I (or other spool users) need to be aware of IC3, its gateway, or anything beyond the gateway?**.  Question context: I'm usually developing my projects under an extremely limited time and money budget, so the simpler and more intuitive things are, the more excited I get.

> All abstracted!!

- {mick} **Will our product ever expose SignalR terminology or concepts to the developer**, or are we tucking that away behind a layer of abstraction?
   - **If we are tucking it away, will the developer be able to configure the signaling transport protocol**?  Question context: When working with SignalR on a budget, I’ve often run into limits with WebSockets at the lower-level app service tiers.  These limits were not always easy to diagnose.  I usually start with “long-polling” and then later, once my product has been validated and I need to scale, I'd optimize towards modern protocols and unit-test those upgrades in isolation.

> Some customers just want the SignalR instance.  We're providing signaling but devs don't need to know about SignalR.  We might have an advanced api that lets power-devs configure stuff.

- {mick} - RE "Nexus" - I see that this term isn’t set in stone, and that you’re looking for suggestions.  SignalR utilizes “Hub” to describe the class through which all I/O travels within an application, and uses “Group” to cluster recipients within Hubs.  I see Spool utilizes the "Group" concept, while "Nexus" describes the class through which all I/O travels within a conversation.  My natural inclination here would be to refer to “nexuses” as “hubs” since it's already part of my lexicon. **Thoughts?**

> We have a list of options - suggestions have already been submitted.

- {mick} - **Is [this the guide](https://msazure.visualstudio.com/One/_git/COSINE-DEP-Spool?path=%2Fdoc%2Fguide%2Fgetting_started.md&_a=preview) that I should use to study Spool code from the perspective of a "new spool developer"**?

> Docs folder does have good info - but other stuff in folder is extracurricular reading.  Samples is where I should focus.

- {mick} - **Would it be useful for you to see a recurring digest of the real-time social media chatter surrounding WebRTC, Twilio, and other related tech / competitors?**  For example - all Reddit conversations over the past week that are related to implementing WebRTC or Twilio in a C# app?

> Not my responsibility - but nobody else is doing it.  Definitely room for an assist here. 
> Maybe one of our teams channels for a dump. 

- {mick} - Amazon recently started inviting me to Developer Huddles.  **Do our product releases incorporate something like this?**

> ~Monthly community calls!  Starting with private preview.  We'll be doing this indefinitely. 

- {mick} - Erin Rifkin recently shared with our org that Satya is very focused on empowering others through Docs + Learn.  I believe the scope of my focus here is on Docs...  **Should we begin having conversations about content beyond Docs, and looping other resources/teams in as needed** (Learn + video content + "other things")?

> Response

- {mick} - **Should we build clientside samples such that the majority of devs are included** (vanilla JS), and then offer framework-specialized integrations later according to demand-per-framework?  Or are we taking a niche-focused approach when it comes to clientside integration and demos (react first)?  If this hasn't been decided yet, do we have any way to ask a large sample size of initial users what they want?

> ask azure api review folks
> preference may be don't use anything weird.


### Prioritization Questions

- {mick} **How should this list of questions be distributed?**
- {mick} - Should any adjustments be made to our docs priorities (link)?
- {mick} - Which scenario(s) appears to be the strongest candidate(s) for our first MVP article set (including conceptual, quickstarts, reference, working samples, etc)?
- {mick} - Who will be my points of contact for samples, technical clarifications, support with existing demos, etc as I move forward?  Would it be ok to set up a small teams group chat to serve as my "technical support system" that I can use in lieu of "tapping people on the shoulder" since I'm working remotely?
