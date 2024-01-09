---
title: "Display text format training data - Speech service"
titleSuffix: Azure AI services
description: Learn about how to prepare display text format training data for custom speech.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 12/14/2023
ms.author: eur
---

# How to prepare display text format training data for custom speech

Azure AI Speech service can be viewed as two components: speech recognition and display text formatting. Speech recognition transcribes audio to lexical text, and then the lexical text is transformed to display text.

:::image type="content" source="./media/custom-speech/speech-recognition-to-display-text.jpg" alt-text="Diagram of the flow of speech recognition to lexical to display text." lightbox="./media/custom-speech/speech-recognition-to-display-text.jpg":::

These are the locales that support the display text format feature: da-DK, de-DE, en-AU, en-CA, en-GB, en-HK, en-IE, en-IN, en-NG, en-NZ, en-PH, en-SG, en-US, es-ES, es-MX, fi-FI, fr-CA, fr-FR, hi-IN, it-IT, ja-JP, ko-KR, nb-NO, nl-NL, pl-PL, pt-BR, pt-PT, sv-SE, tr-TR, zh-CN, zh-HK.

## Default display text formatting

The display text pipeline is composed by a sequence of display format builders. Each builder corresponds to a display format task such as ITN, capitalization, and profanity filtering. 

- **Inverse Text Normalization (ITN)** - To convert the text of spoken form numbers to display form. For example: `"I spend twenty dollars" -> "I spend $20"`
- **Capitalization** - To upper case entity names, acronyms, or the first letter of a sentence. For example: `"she is from microsoft" -> "She is from Microsoft"`
- **Profanity filtering** - Masking or removal of profanity words from a sentence. For example, assuming "abcd" is a profanity word, then the word will be masked by profanity masking: `"I never say abcd" -> "I never say ****"`

The base builders of the display text pipeline are maintained by Microsoft for the general purpose display processing tasks. You get the base builders by default when you use the Speech service. For more information about out-of-the-box formatting, see [Display text format](./display-text-format.md).

## Custom display text formatting

Beside the base builders maintained by Microsoft for the general purpose display processing tasks, you can define custom display text formatting rules to customize the display text formatting pipeline for your specific scenarios. The custom display text formatting rules are defined in a custom display text formatting file.

- [Custom ITN](#custom-itn) - Extend the functionalities of base ITN, by applying a rule based custom ITN model from customer.
- [Custom rewrite](#custom-rewrite) - Rewrite one phrase to another based on a rule based model from customer. 
- [Custom profanity filtering](#custom-profanity) - Perform profanity handling based on the profanity word list from customer.

The order of the display text formatting pipeline is illustrated in this diagram.

:::image type="content" source="./media/custom-speech/display-text-pipeline.jpg" alt-text="Diagram of the display format builders." lightbox="./media/custom-speech/display-text-pipeline.jpg":::

## Custom ITN

The philosophy of pattern-based custom ITN is that you can specify the final output that you want to see. The Speech service figures out how the words might be spoken and map the predicted spoken expressions to the specified output format.

A custom ITN model is built from a set of ITN rules. An ITN rule is a regular expression like pattern string, which describes:

* A matching pattern of the input string
* The desired format of the output string

The default ITN rules provided by Microsoft are applied first. The output of the default ITN model is used as the input of the custom ITN model. The matching algorithm inside the custom ITN model is case-insensitive.

There are four categories of pattern matching with custom ITN rules.
- [Patterns with literals](#patterns-with-literals)
- [Patterns with wildcards](#patterns-with-wildcards)
- [Patterns with Regex-style Notation](#patterns-with-regex-style-notation)
- [Patterns with explicit replacement](#patterns-with-explicit-replacement)

### Patterns with literals

For example, a developer might have an item (such as a product) named with the alphanumeric form `JO:500`.  The job of our system will be to figure out that users might say the letter part as `J O`, or they might say `joe`, and the number part as `five hundred` or `five zero zero` or `five oh oh` or `five double zero`, and then build a model that maps all of these possibilities back to `JO:500` (including inserting the colon).

Patterns can be applied in parallel by specifying one rule per line in the display text formatting file. Here is an example of a display text formatting file that specifies two rules:

```text
JO:500
MM:760
```

### Patterns with wildcards

Suppose a customer needs to refer to a whole series of alphanumeric items named `JO:500`, `JO:600`, `JO:700`, etc. We can support this without requiring spelling out all possibilities in several ways.

Character ranges can be specified with the notation `[...]`, so `JO:[5-7]00` is equivalent to writing out three patterns.

There's also a set of wildcard items that can be used.  One of these is `\d`, which means any digit.  So `JO:\d00` covers `JO:000`, `JO:100`, and others up to `JO:900`.

Like a regular expression, there are several predefined character classes for an ITN rule:

* `\d` - match a digit from '0' to '9', and output it directly
* `\l` - match a letter (case-insensitive) and transduce it to lower case
* `\u` - match a letter (case-insensitive) and transduce it to upper case
* `\a` - match a letter (case-insensitive) and output it directly

There are also escape expressions for referring to characters that otherwise have special syntactic meaning:

* `\\` - match and output the char `\`
* `\(` and `\)`
* `\{` and `\}`
* `\|`
* `\+` and `\?` and `\*`

### Patterns with regex-style notation

To enhance the flexibility of pattern writing, regular expression-like constructions of phrases with alternatives and Kleene-closure are supported.

* A phrase is indicated with parentheses, like `(...)` - The parentheses don't literally count as characters to be matched.
* You can indicate alternatives within a phrase with the `|` character such as `(AB|CDE)`.
* You can suffix a phrase with `?` to indicate that it's optional, `+` to indicate that it can be repeated, or `*` to indicate both. You can only suffix phrases with these characters and not individual characters (which is more restrictive than most regular expression implementations).

A pattern such as `(AB|CD)-(\d)+` would represent constructs like "AB-9" or "CD-22" and be expanded to spoken words like `A B nine` and `C D twenty two` (or `C D two two`).

### Patterns with explicit replacement

The general philosophy is "you show us what the output should look like, and the Speech service figures out how people say it." But this doesn't always work because some scenarios might have quirky unpredictable ways of saying things, or the Speech service background rules might have gaps. For example, there can be colloquial pronunciations for initials and acronyms--`ZPI` might be spoken as `zippy`. In this case a pattern like `ZPI-\d\d` is unlikely to work if a user says `zippy twenty two`.  For this sort of situation, there's a display text format notation `{spoken>written}`. This particular case could be written out `{zippy>ZPI}-\d\d`.

This can be useful for handling things that the Speech mapping rules but don't yet support. For example you might write a pattern `\d0-\d0` expecting the system to understand that "-" can mean a range, and should be pronounced `to`, as in `twenty to thirty`. But perhaps it doesn't. So you can write a more explicit pattern like `\d0{to>-}\d0` and tell it how you expect the dash to be read.

You can also leave out the `>` and following written form to indicate words that should be recognized but ignored. So a pattern like `{write} (\u.)+` recognizes `write A B C` and output `A.B.C`--dropping the `write` part.

### Custom ITN Examples

#### Group digits

To group 6 digits into two groups and add a '-' character between them:

> ITN rule: `\d\d\d-\d\d\d` 
Sample: `"cadence one oh five one fifteen" -> "cadence 105-115"`

#### Format a film name

*Space: 1999* is a famous film, to support it:

> ITN rule: `Space: 1999` 
Sample: `"watching space nineteen ninety nine" -> "watching Space: 1999"`

#### Pattern with Replacement

> ITN rule: `\d[05]{ to >-}\d[05]`
Sample: `fifteen to twenty -> 15-20`

## Custom rewrite

General speaking, for an input string, rewrite model tries to replace the `original phrase` in the input string with the corresponding `new phrase` for each rewrite rule. A rewrite model is a collection of rewrite rules.

* A rewrite rule is a pair of two phrases: the original phrase and a new phrase. 
* The two phrases are separated by a TAB character. For example, `original phrase`{TAB}`new phrase`.
* The original phrase is matched (case-insensitive) and replaced with the new phrase (case-sensitive). [Grammar punctuation characters](#grammar-punctuation) in the original phrase are ignored during match. 
* If any rewrite rules conflict, the one with the longer `original phrase` is used as the match.

The rewrite model supports grammar capitalization by default, which capitalizes the first letter of a sentence for `en-US` like locales. It's turned off if the capitalization feature of display text formatting is turned off in a speech recognition request.

#### Grammar punctuation

Grammar punctuation characters are used to separate a sentence or phrase, and clarify how a sentence or phrase should be read.

> `. , ? 、 ! : ; ？ 。 ， ¿ ¡ । ؟ ، ` 

Here are the grammar punctuation rules:
- The supported punctuation characters are for grammar punctuation if they're followed by space or at the beginning or end of a sentence or phrase. For example, the `.` in `x. y` (with a space between `.` and `y`) is a grammar punctuation.
- Punctuation characters that are in the middle of a word (except `zh-cn` and `ja-jp`) aren't grammar punctuation. In that case, they're ordinary characters. For example, the `.` in `x.y` isn't a grammar punctuation.
- For `zh-cn` and `ja-jp` (nonspacing locales), punctuation characters are always used as grammar punctuation even if they are between characters. For example, the `.` in `中.文` is a grammar punctuation.

### Custom rewrite examples

#### Spelling correction

The name `CVOID-19` might be recognized as `covered 19`. To make sure that `COVID-19 is a virus` is displayed instead of `covered 19 is a virus`, use the following rewrite rule:

```text
#rewrite
covered 19{TAB}COVID-19
```

#### Name capitalization

Gottfried Wilhelm Leibniz was a German mathematician. To make sure that `Gottfried Wilhelm Leibniz` is capitalized, use the following rewrite rule:

```text
#rewrite
gottfried leibniz{TAB}Gottfried Leibniz
```

## Custom profanity

A custom profanity model acts the same as the base profanity model, except it uses a custom profanity phrase list. In addition, the custom profanity model tries to match (case insensitive) all the profanity phrases defined in the display text formatting file.
- The profanity phrases are matched (case-insensitive).
- If any profanity phrases rules conflict, the longest phrase is used as the match.
- These punctuation characters aren't supported in a profanity phrase: `. , ? 、 ! : ; ？ 。 ， ¿ ¡ । ؟ ، `.
- For `zh-CN` and `ja-JP` locales, English profanity phrases aren't supported. English profanity words are supported. Profanity phrases for `zh-CN` and `ja-JP` locales are supported.

The profanity is removed or masked depending on your speech recognition request settings.

Once profanity is added in the display text format rule file and the custom model is trained, it's used for the default output in batch speech to text and real-time speech to text.

### Custom profanity examples

Here are some examples of how to mask profanity words and phrases in the display text formatting file.

#### Mask single profanity word example

Assume `xyz` is a profanity word. To add it:

```text
#profanity
xyz
```

Here's a test sample: `Turned on profanity masking to mask xyz -> Turned on profanity masking to mask ***`

#### Mask profanity phrase

Assume `abc lmn` is a profanity phrase. To add it:

```text
#profanity
abc lmn
```

Here's a test sample: `Turned on profanity masking to mask abc lmn -> Turned on profanity masking to mask *** ***`

## Next Steps

- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
