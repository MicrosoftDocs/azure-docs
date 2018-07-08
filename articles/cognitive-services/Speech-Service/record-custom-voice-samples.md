---
title: How to record voice samples for creating a custom voice | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Make a production-quality costum voice by preparing a robust script, hiring good voice talent, and recording professionally.
services: cognitive-services
author: v-jerkin
manager: noellelacharite
ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/5/2018
ms.author: v-jerkin
---

# How to record voice samples for a custom voice

Creating a high-quality production custom voice from scratch is not a casual undertaking. The central component of a custom voice is a large collection of audio samples of human speech. It's vital that these audio recordings be of high quality. Choose voice talent that has experience making these kinds of recordings, and have them recorded by a competent recording engineer using professional equipment.

Before you can make these recordings, though, you need a script: the words that will be read by your voice talent to create the audio samples. For best results, your script must have good phonetic coverage and sufficient variety to train the custom voice model.

Many ingredients go into a good custom voice. This guide serves as an introduction to the process, with particular focus on issues you are likely to encounter.

> [!TIP]
> For the highest quality results, consider engaging Microsoft to help develop your custom voice. Microsoft has extensive experience producing high-quality voices for its own products, including Cortana and Office.

## Voice recording roles

There are four basic roles in a voice recording project for custom voices.

Role|Purpose
-|-
Voice talent        |The person whose voice will form the basis of the custom voice.
Recording engineer  |The person who oversees the technical aspects of the recording and operates the recording equipment.
Director            |Prepares the script and coaches the voice talent's performance.
Editor              |Finalizes the audio files and prepares them for upload to the Custom Voice portal.

An individual may fill more than one role. This guide assumes that you will be primarily filling the director role, and hiring voice talent and a recording engineer. There is some information about the recording engineer role in case you want to make the recordings yourself.

## Choosing voice talent

Actors with experience in voiceover or voice character work make good custom voice talent. You can also often find suitable talent among announcers and newsreaders. 

Choose voice talent whose natural voice you like. It is possible to create unique "character" voices, but it's much harder for most talent to perform them consistently, and the effort can cause voice strain.

> [!TIP]
> Generally, avoid using recognizable voices to create a custom voice—unless, of course, your goal is to produce a celebrity voice. Lesser-known voices are usually less distracting to users.

The single most important factor for choosing voice talent is consistency. Ideally, all your recordings should sound like they were made on the same day in the same room. You can approach this ideal through good recording practices and engineering. 

Your voice talent is the other half of the equation. He or she must be able to speak with consistent rate, volume level, pitch, and tone. Clear diction is a must. Your talent also needs to be able to strictly control his or her pitch variation, emotional affect, and speech mannerisms.

Recording custom voice samples can be more fatiguing than other kinds of voice work. Most voice talent can record for two or three hours a day. Limit sessions to three or four a week, with a day off in between if possible.

Recordings made for a voice model should be emotionally neutral. That is, a sad utterance should not be read in a sad way. Neutrality lets mood be added to the synthesized speech later. Work with your voice talent to develop a "persona" that defines the overall sound and emotional tone of the custom voice. This process will pinpoint what "neutral" sounds like for that persona.

A persona may have, for example, a naturally upbeat personality. So their voice may carry a note of optimism even when speaking neutrally. However, any such personality trait should be subtle and consistent. Listen to some existing voices to get an idea of what you're aiming for.

### Legalities

Usually, you'll want to own the voice recordings you make. Your voice talent should therefore be amenable to a work-for-hire contract for the project.

## Creating a script

The starting point of any custom voice is the script, which contains the utterances to be recorded by your voice talent. The term "utterances" encompasses both full sentences and shorter phrases.

The utterances in your script can come from anywhere: fiction, non-fiction, transcripts of speeches, news reports, and anything else available in printed form. If you want to make sure your voice does well on specific kinds of words (such as medical terminology or programming jargon), you may want to include sentences from scholarly papers or technical documents. (However, see [Legalities](#legalities) below.) You can also write your own text.

Your utterances don't need come from the same source, or the same kind of source. They don't even need to have anything to do with each other. However, if you will use set phrases (for example, "You have successfully logged in") in your speech application, make sure to include them in your script. This wil give your custom voice a better chance of pronouncing those phrases well. And if you later decide to use a recording in place of synthesized speech, you'll already have it.

While consistency is key in choosing voice talent, variety is the hallmark of a good script. Your script should include many different words and sentences with a variety of sentence lengths, structures, and moods. Every sound in the language should be represented multiple times and in numerous contexts (called *phonetic coverage).* 

Furthermore, the text should incorporate all the ways that a particular sound can be represented in writing, and place each sound at varying places in the sentences. Both declarative sentences and questions should be included, and read with appropriate intonation.

It's difficult to write a script that provides *just enough* data to allow the Custom Speech portal to build a good voice. In practice, the simplest way to make a script that achieves robust phonetic coverage is to increase the number of samples. Microsoft's standard voices were built from tens of thousands of utterances. You should be prepared to record a few to several thousand utterances to build a production-quality custom voice.

Check the script carefully for errors. If possible, have someone else check it too. When you run through the script with your talent, you'll probably catch a few more mistakes.

### Script format

You can easily create your script using Microsoft Word. This document is for your use during the recording session, so you can set it up any way you find easy to work with. Create the text file required by the Custom Voice portal separately.

A basic script format includes three columns:

* The number of the utterance, starting at 1. Numbering will make it easy for everyone in the studio to refer to a particular utterance ("let's try number 356 again"). You can use Word's paragraph numbering feature to number the rows of the table automatically.
* A blank column where you'll write in the time code of each utterance: the time at which you'll find it in the recorded audio file.
* The text of the utterance itself.

![Sample script](media/custom-voice/script.png)

Leave enough space after each row to write notes. Be sure that no utterance is split between pages. Number the pages and print your script on one side of the paper.

Print three copies of the script: one for the talent, one for the engineer, and one for the director (you). Don't staple the pages together: an experienced voice artist will just take them out before recording to avoid making noise as the pages are turned.

### Legalities

Under copyright law, n actor's reading of copyrighted text is technically a performance for which the author of the work may need to be compensated. This performance will not be recognizable in the final product, the custom voice. Even so, the legality of using a copyrighted work for this purpose is not well-established. Microsoft cannot provide legal advice on this issue; consult your own counsel.

Fortunately, it is easy to avoid these issues entirely. There are many sources of text you can use without permission or license.

|||
|-|-|
|[CMU Arctic corpus](http://festvox.org/cmu_arctic/)|About 1100 sentences selected from out-of-copyright works specifically for use in speech synthesis projects. An excellent starting point.|
|Works with<br>expired copyright|Typically works published prior to 1923. For English, Project Gutenberg offers tens of thousands of such works. You may want to focus on newer works, as the language will be closer to modern English.|
|Government&nbsp;works|Works created by the United States government are not copyrighted in the United States, though the government may claim copyright in other countries.|
|Public domain|Works for which copyright has been explicitly disclaimed or that have been dedicated to the public domain.|
|Permissively-licensed works|Works distributed under a license such as Creative Commons or the GNU Free Documentation License. Wikipedia uses the GFDL. Some licenses, however, may impose restrictions on performance of the licensed content that may impact the creation of a custom voice model, so read the license carefully.|

## Recording your script

Preferably, you should ecord your script at a professional recording studio that specializes in voiceover work. They'll have a recording booth, the right equipment for the job, and the right people to operate it. It pays not to skimp on recording.

Discuss your project with the studio's recording engineer and listen to his or her advice. The recording should have little or no dynamic range compression (maximum of 4:1). It is critical that the audio have consistent volume and a high signal-to-noise ratio, while being free of unwanted sounds.

### Doing it yourself

If you want to make the recording yourself, here's what you need to know. 

Your "recording booth" should be a small room with no noticeable echo or "room tone" and which is as quiet and soundproof as possible. Drapes on the walls can be used to reduce echo and neutralize or "deaden" the sound of the room.

Use a high-quality studio condenser microphone intended for recording voice. Sennheiser, AKG, and even newer Zoom mics can yield good results. You can rent one from a local audio-visual rental firm. Look for one with a USB interface. This type of mic conveniently combines the mic, preamp, and analog-to-digital converter into one product, simplifying hookup.

You may also use an analog microphone. Many rental houses offer "vintage" microphones which are renowned for their voice character. Professional analog gear includes balanced XLR connectors, rather than the 1/4" plug used in consumer equipment. You'll need a preamp and an audio interface with these connectors.

Install the microphone on a stand or boom and use a pop filter in frot of the microphone to eliminate noise from "plosive" sounds like "p" and "b." Some microphones come with a suspension mount that isolates them from vibrations in the stand, which is helpful.

The voice talent must stay at a consistent distance from the microphone. Use tape on the floor to mark where they should stand. If the talent prefers to sit, take special care. Sitting may complicate maintaining a constant distance from the mic, and adds a new source of unwanted sounds to watch out for (the chair).

Use a stand to hold the script; avoid angling the stand so that it can reflect sound toward the microphone.

The person actually doing the recording—the engineer—should be in a separate room from the talent, with some way to talk to the talent in the recording booth (a "talkback").

The recording should contain as little noise as possible, with a goal of an 80 db signal-to-noise ratio or better.

Listen closely to a recording of silence, figure out where any noise is coming from, and eliminate the cause. Common sources of noise are air vents, fluorescent light ballasts, traffic on nearby roads, and equipment fans (even notebook PCs may have fans). Microphones and cables can pick up electrical noise from AC wiring, usually a hum or buzz.

> [!TIP]
> In some cases, you may be able to use an equalizer or a noise reduction software plug-in to help remove noise from your recordings, though it is always best to stop it at its source when possible.

Levels should be set so that most of the available dynamic range of digital recording is used without overdriving into distortion. That means loud, but not so loud that the audio distorts. Below is an example of the waveform of a good recording.

![good recording waveform](media/custom-voice/good-recording.png)

You can see that most of the range (height) is used, but the highest peaks of the signal do not reach the top. You can also see that the silence in the recording approximates a tihn horizontal line, indicating a low noise floor. This recording has acceptable dynamic range and signal-to-noise ratio.

Record directly into the computer using a high-quality audio interface or a USB port, depending on the kind of mic you're using. Keep the audio chain simple: mic, preamp, audio interface, computer. Both [Avid Pro Tools](http://www.avid.com/en/pro-tools) and [Adobe Audition](https://www.adobe.com/products/audition.html) can be licensed monthly at reasonable cost. If you have literally no budget, try the free [Audacity](https://www.audacityteam.org/).

Record at 44.1 KHz 16 bit monophonic (CD quality) or better. Current state-of-the-art is 48 KHz 24-bit, if your equipment supports it. You will downsample your audio to 16 KHz 16-bit before you submit it to the Custom Voice portal. Still, it pays to have a high-quality original recording in case edits are needed.

Ideally, have different people serve in the roles of director, engineer, and talent. Don't try to do it all yourself! In a pinch, the director and engineer could be a single person.

### Before the session

To avoid wasting studio time, run through the script with your voice talent before the recording session. The voice talent gets a chance to become familiar with the text, and can clarify the pronunciation of any unfamiliar words.

> [!NOTE]
> Most recording studios offer electronic display of scripts in the recording booth. In this case, type any take notes from your run-through directly into the script's document. You'll still want a paper copy to take notes on during the session, though. Most engineers will want a hardcopy, too. And you'll still want the third printed copy as a backup for the talent in case the computer is down!

Your voice talent may ask which word you want emphasized in an utterance. Actors often call this the "operative word." You don't want any particular word emphasized, so tell them you want a natural reading. Emphasis can be added when new speech is synthesized; it should not be a part of the original recording.

Direct the talent to pronounce words distinctly. Every word of the script should be pronounced as written. Sounds should not be omitted or slurred together, as is common in casual speech, unless they have been written that way in the script.

|Written text|Unwanted casual pronunciation|
|-|-|
|never going to give you up|never gonna give you up|
|there are four lights|there're four lights|
|how's the weather today|how's th' weather today|
|my little pony|my lil' pony|

Talent should *not* add distinct pauses between words. The sentence should still flow naturally, if slightly formal. This fine distinction may take some practice to get right.

### The recording session

Create a reference recording early in the session of a typical utterance and play it back to the voice talent regularly to help them keep their performance consistent. The engineer can use it as a reference for levels and overall consistency of sound. This is especially important when resuming recording after a break, or on another day.

Coach your talent to take a deep breath and pause for a moment before each utterance. Record a couple of seconds of silence between utterances. Pacing should be consistent; a metronome played through the talent's headphones may be helpful if they're having trouble. Words should be pronounced the same way each time they appear.

Record a good five seconds of silence before the first recording to capture the "room tone." This helps the Custom Voice portal compensate for any remaining noise in the recordings.

> [!TIP]
> All you really need to record is the voice talent, so it's fine to make a monophonic (single-channel) recording of just that. However, if you record in stereo, the second channel can be used to record the chatter in the control room so you can refer to it later. Remove this track from the version uploaded to the Custom Voice portal.

Listen closely, using headphones, to the voice talent's performance. You're looking for good but natural diction, correct pronunciation, and a lack of unwanted sounds. Don't hesitate to ask your talent to re-record an utterance that doesn't meet these standards. 

> [!TIP] 
> If you are recording a high volume of utterances, losing a single utterance may not affect the resulting voice in any noticeable way. So it may be more expedient to simply note any utterances that have problems, exclude them from your data set, and see how your voice turns out. You can always go back to the studio and record more samples later.

Most studios have a large "time code" display indicating the current time in the recording. Take a note of the time on your script for each utterance. Ask the engineer if they can mark each utterance in the recording's metadata or cue sheet.

Take regular breaks to let the voice talent keep his or her voice in good shape. Provide them with something to drink to keep their throat from getting dry.

### After the session

Modern recording studios record on a computer. At the end of the session, then, you receive one or more audio files, not a tape. These files will probably be WAV or AIFF format in CD quality (44.1 KHz 16-bit) or better. 48 KHz 24-bit is common and desirable. Higher sampling rates, such as 96 KHz, are generally not needed.

The studio will probably deliver one or more audio files, each containing many utterances. To upload the recordings to the Custom Voice portal, each utterance must be in its own file. The recording engineer may have placed a marker in the file (or provided a separate cue list) to indicate where each utterance starts. This metadata can be used to extract the utterances.

You'll need to go through the full recording and make a WAV file for each utterance. Use your notes to find the exact utterances you want, then use a sound editing utility such as [Avid Pro Tools](http://www.avid.com/en/pro-tools), [Adobe Audition](https://www.adobe.com/products/audition.html), or the free [Audacity](https://www.audacityteam.org/) to copy each into a new file.

Leave only about 0.2 seconds of silence at the beginning and end of each clip except for the first. That file should start with a full five seconds of silence. Do not use the audio editor to "zero out" silent parts of the file. Including the "room tone" will help the machine learning algorithms compensate for any residual background noise.

Listen to each file carefully. At this stage, you can edit out small unwanted sounds that you missed during recording—as long as they don't overlap any actual speech. If you can't fix a file, remove it from your data set entirely, making a note that you have done so.

Downsample each file to 16 KHz and 16 bits before saving and, if you recorded in stereo, remove the second channel. Save each file in WAV format.

Archive the original recording in a safe place in case you need to go back to it later. Preserve your script and notes, too.

## Next steps

You're ready to upload your recordings and create your custom voice!

> [!div class="nextstepaction"]
> [Creating custom voice fonts](how-to-customize-voice-font.md)
