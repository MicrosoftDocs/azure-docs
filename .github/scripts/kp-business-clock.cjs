const {createHash} = require('node:crypto');

const PREFIX = '<!-- kp-business-clock:v1\n';
const BOT = 'github-actions[bot]';
const HOUR = 3600000;
const OVERLAP = 5 * 60000;
const FEEDBACK = Symbol('complete feedback snapshot');
const FEEDBACK_POLICY = 'github-bot-excluded-v1';
class UncertainActivity extends Error {}
function isIgnoredBot(actor) {
  if (!actor || typeof actor.login !== 'string' || !actor.login) {
    throw new UncertainActivity('Uncertain KP activity: missing actor identity');
  }
  const type = actor.type || actor.__typename;
  if ((actor.type && actor.__typename && actor.type !== actor.__typename) ||
      (type !== 'Bot' && type !== 'User')) {
    throw new UncertainActivity('Uncertain KP activity: ambiguous actor type');
  }
  return type === 'Bot';
}
function sameActor(left, right) {
  return isIgnoredBot(left) === isIgnoredBot(right) &&
    left.login.toLowerCase() === right.login.toLowerCase();
}
const ACTIVITY_EVENTS = new Set([
  'commented', 'reviewed', 'renamed', 'assigned', 'unassigned', 'labeled', 'unlabeled',
  'milestoned', 'demilestoned', 'review_requested', 'review_request_removed', 'review_dismissed',
  'ready_for_review', 'convert_to_draft', 'base_ref_changed', 'head_ref_force_pushed',
  'head_ref_deleted', 'head_ref_restored', 'closed', 'reopened', 'merged', 'referenced',
  'cross-referenced', 'connected', 'disconnected', 'locked', 'unlocked', 'added_to_project',
  'moved_columns_in_project', 'removed_from_project', 'auto_merge_enabled', 'auto_merge_disabled',
  'auto_squash_enabled', 'auto_rebase_enabled', 'pinned', 'unpinned', 'edited'
]);
const DEFAULT_MESSAGE = '### Knowledge Partnership - Author action needed\n\n<br>\n\n' +
  'Thanks for your work on this pull request. Comments may need your attention, or your branch may need to be synced with its target branch. Please check the latest comments and validation results and update the PR as needed. If anything is unclear, let us know in the PR, and we will help identify the best next step.\n\n' +
  '**Need help?** Visit [Knowledge Partnership support](https://aka.ms/kp-support).';
const weekday = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', weekday: 'short'
});

function isDue(activityAt, now, days) {
  let remaining = days * 24 * HOUR;
  let cursor = Date.parse(activityAt);
  if (!Number.isFinite(cursor) || !Number.isFinite(now) ||
      !Number.isInteger(days) || days < 0) throw new Error('Invalid business clock settings');
  // Los Angeles weekday boundaries and DST transitions fall on UTC hour boundaries.
  while (cursor < now && remaining > 0) {
    const next = Math.min(now, (Math.floor(cursor / HOUR) + 1) * HOUR);
    if (!['Sat', 'Sun'].includes(weekday.format(cursor))) remaining -= next - cursor;
    cursor = next;
  }
  return remaining <= 0;
}

function fingerprint(pr, managedLabels, eventLabel) {
  return createHash('sha256').update(JSON.stringify({
    title: pr.title, body: pr.body, head: pr.head.sha, base: pr.base.ref,
    draft: pr.draft, milestone: pr.milestone?.number,
    assignees: pr.assignees.map(item => item.login).sort(),
    reviewers: pr.requested_reviewers.map(item => item.login).sort(),
    teams: pr.requested_teams.map(item => item.id).sort(),
    labels: pr.labels.map(item => item.name)
      .filter(name => name !== eventLabel && !managedLabels.includes(name)).sort()
  })).digest('hex');
}

function readClock(comment) {
  const clock = JSON.parse(comment.body.slice(PREFIX.length).split('\n-->')[0]);
  if (!Number.isFinite(Date.parse(clock.activityAt)) ||
      !Number.isFinite(Date.parse(clock.observedAt)) ||
      !/^[a-f0-9]{64}$/.test(clock.fingerprint)) throw new Error('Invalid persisted KP clock');
  if (clock.nonBodyFingerprint !== undefined &&
      (typeof clock.nonBodyFingerprint !== 'string' || !/^[a-f0-9]{64}$/.test(clock.nonBodyFingerprint))) {
    throw new Error('Invalid persisted KP nonbody provenance');
  }
  if (clock.commentIds !== undefined) validateCommentIdentities(clock.commentIds);
  if (clock.feedbackPolicy !== undefined &&
      (clock.feedbackPolicy !== FEEDBACK_POLICY || clock.commentIds === undefined)) {
    throw new Error('Invalid persisted KP feedback policy');
  }
  if (clock.confirmedDeletedReviewIds !== undefined) {
    if (!Array.isArray(clock.confirmedDeletedReviewIds) ||
        clock.feedbackPolicy !== FEEDBACK_POLICY ||
        clock.confirmedDeletedReviewIds.some((id, index, ids) =>
          !Number.isSafeInteger(id) || id <= 0 || (index > 0 && id <= ids[index - 1]) ||
          clock.commentIds.review.includes(id))) {
      throw new Error('Invalid persisted KP inline deletion provenance');
    }
  }
  if (clock.lastReviewedAt !== undefined && !Number.isFinite(Date.parse(clock.lastReviewedAt))) {
    throw new Error('Invalid persisted KP review checkpoint');
  }
  return clock;
}

function clockBody(clock) {
  let visible = 'Created by PR Monitor bot for Ignite 2026 from the Knowledge Partnership team.';
  {
    const date = new Date(clock.activityAt);
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      timeZoneName: 'short'
    }).formatToParts(date).map(part => [part.type, part.value]));
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', timeZoneName: 'longOffset'
    }).formatToParts(date).find(part => part.type === 'timeZoneName').value.replace('GMT', 'UTC');
    visible += `\n3 day clock started on ${parts.year}-${parts.month}-${parts.day} ` +
      `${parts.hour}:${parts.minute}:${parts.second} ${parts.timeZoneName} (${offset})`;
  }
  return PREFIX + JSON.stringify(clock) + '\n-->\n' + visible;
}

async function activity(github, repo, pr, comment, comments, settings, now = Date.now) {
  const startedAt = typeof now === 'function' ? now() : now;
  if (!Number.isFinite(startedAt)) throw new Error('Invalid KP review start');
  validateFeedbackCounts(pr);
  const hash = fingerprint(pr, settings.managedLabels, settings.event);
  const nonBodyFingerprint = fingerprint({...pr, body: null}, settings.managedLabels, settings.event);
  const clock = comment ? readClock(comment) : {
    activityAt: pr.updated_at, fingerprint: hash
  };
  if (clock.lastReviewedAt && Date.parse(clock.lastReviewedAt) > startedAt) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: review checkpoint is in the future`);
  }
  const since = clock.lastReviewedAt ? Date.parse(clock.lastReviewedAt) - OVERLAP : -Infinity;
  if (!Number.isFinite(Date.parse(clock.activityAt))) throw new Error('Missing PR update time');
  const summaries = [];
  let bodyEditedAt = null;
  let bodyEditSnapshot;
  let after = null;
  const cursors = new Set();
  do {
    const edited = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!,$after:String) {
      repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
        lastEditedAt editor { login __typename } reviews(first:100,after:$after) {
          nodes { submittedAt lastEditedAt author { login __typename } editor { login __typename } }
          pageInfo { hasNextPage endCursor }
        }
      } }
    }`, {...repo, number: pr.number, after});
    const record = edited.repository?.pullRequest;
    if (!record || (record.lastEditedAt !== null &&
        (typeof record.lastEditedAt !== 'string' || !Number.isFinite(Date.parse(record.lastEditedAt))))) {
      throw new Error(`Missing or invalid server PR edit time on #${pr.number}`);
    }
    let editorIsBot = null;
    if (record.lastEditedAt !== null) {
      editorIsBot = isIgnoredBot(record.editor);
      summaries.push({updated_at: record.lastEditedAt, user: record.editor});
    }
    const bodySnapshot = JSON.stringify([record.lastEditedAt, editorIsBot,
      record.lastEditedAt === null ? null : record.editor.login.toLowerCase()]);
    if (bodyEditSnapshot !== undefined && bodySnapshot !== bodyEditSnapshot) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: body edit changed during pagination`);
    }
    bodyEditSnapshot = bodySnapshot;
    bodyEditedAt = record.lastEditedAt !== null && !editorIsBot ? record.lastEditedAt : null;
    const connection = record.reviews;
    if (!Array.isArray(connection?.nodes) || typeof connection.pageInfo?.hasNextPage !== 'boolean') {
      throw new Error(`Missing review-summary activity on #${pr.number}`);
    }
    for (const review of connection.nodes) {
      if (review.submittedAt === null) continue;
      if (!Number.isFinite(Date.parse(review.submittedAt)) ||
          (review.lastEditedAt !== null && !Number.isFinite(Date.parse(review.lastEditedAt)))) {
        throw new Error(`Invalid review-summary time on #${pr.number}`);
      }
      const ignored = isIgnoredBot(review.author);
      summaries.push({updated_at: review.submittedAt, user: review.author});
      if (review.lastEditedAt !== null) {
        const editor = ignored ? review.author : review.editor;
        isIgnoredBot(editor);
        summaries.push({updated_at: review.lastEditedAt, user: editor});
      }
    }
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
    if (typeof after !== 'string' || !after || cursors.has(after)) {
      throw new Error(`Invalid review-summary pagination on #${pr.number}`);
    }
    cursors.add(after);
  } while (true);
  const events = await github.paginate(github.rest.issues.listEventsForTimeline, {
    ...repo, issue_number: pr.number, per_page: 100
  });
  let reviews = await github.paginate(github.rest.pulls.listReviewComments, {
    ...repo, pull_number: pr.number, per_page: 100
  });
  if (pr.comments !== comments.length || pr.review_comments !== reviews.length) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback counts disagree with complete reads`);
  }
  const commentIds = commentIdentities(comments, reviews, settings);
  const ignoredIds = Object.fromEntries([['issue', comments], ['review', reviews]]
    .map(([kind, entries]) => [kind, new Set(entries.filter(item => isIgnoredBot(item.user))
      .map(item => item.id))]));
  let latest = clock.activityAt;
  const deletedReviews = new Set(clock.confirmedDeletedReviewIds);
  if (reviews.some(item => deletedReviews.has(item.id))) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: confirmed deleted inline feedback reappeared`);
  }
  if (clock.commentIds && ['issue', 'review'].some(kind => {
    const current = new Set(commentIds[kind]);
    return clock.commentIds[kind].some(id => !current.has(id) && !ignoredIds[kind].has(id));
  })) {
    if (clock.feedbackPolicy !== FEEDBACK_POLICY) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: missing legacy feedback authors`);
    }
    const confirmedComments = await github.paginate(github.rest.issues.listComments, {
      ...repo, issue_number: pr.number, per_page: 100
    });
    const confirmedReviews = await github.paginate(github.rest.pulls.listReviewComments, {
      ...repo, pull_number: pr.number, per_page: 100
    });
    if (JSON.stringify(commentIds) !==
        JSON.stringify(commentIdentities(confirmedComments, confirmedReviews, settings)) ||
        confirmedComments.length !== pr.comments || confirmedReviews.length !== pr.review_comments) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback changed while confirming deletion; retry with fresh reads`);
    }
    const completedAt = typeof now === 'function' ? now() : now;
    if (!Number.isFinite(completedAt)) throw new Error('Invalid comment observation time');
    if (completedAt > Date.parse(latest)) latest = new Date(completedAt).toISOString();
    comments = confirmedComments;
    reviews = confirmedReviews;
    for (const id of clock.commentIds.review) {
      if (!reviews.some(item => item.id === id)) deletedReviews.add(id);
    }
  }
  const deletedWrappers = [];
  const timeline = events.flatMap(event => {
    if (event.event === 'commented') {
      if (!Number.isSafeInteger(event.id) || event.id <= 0) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid issue timeline comment identity`);
      }
      const current = comments.find(item => item.id === event.id);
      if (current && !sameActor(event.actor || event.user, current.user)) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: issue timeline attribution disagrees with complete reads`);
      }
    }
    if (event.event === 'line-commented') {
      if (!Array.isArray(event.comments) || !event.comments.length || event.comments.some(item => {
        if (!item || typeof item !== 'object' || !Number.isSafeInteger(item.id) || item.id <= 0) return true;
        const current = reviews.find(review => review.id === item.id);
        if (isIgnoredBot(item.user)) {
          if (deletedReviews.has(item.id)) return true;
          return current && (!isIgnoredBot(current.user) ||
            item.user.login.toLowerCase() !== current.user.login.toLowerCase());
        }
        if (!current && deletedReviews.has(item.id)) {
          deletedWrappers.push([item.id, item.body, item.user.login.toLowerCase(), item.created_at, item.updated_at]);
          return false;
        }
        return !current || isIgnoredBot(current.user) ||
          JSON.stringify([item.id, item.body, item.user?.login, item.created_at, item.updated_at]) !==
          JSON.stringify([current.id, current.body, current.user?.login, current.created_at, current.updated_at]);
      })) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: inline timeline coverage disagrees with complete reads`);
      }
      return event.comments;
    }
    return [event];
  });
  let bookkeepingAt = -Infinity;
  let membershipWrite = false;
  let metadataObscured = false;
  let excludedActivity = false;
  let meaningfulAt = Date.parse(pr.created_at);
  for (const event of [...timeline, ...comments, ...reviews, ...summaries]) {
    if (event.event === 'committed') continue;
    if (event.actor && event.user && !sameActor(event.actor, event.user)) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback actor identities disagree`);
    }
    if (event.event === 'copilot_work_started' &&
        (!Number.isSafeInteger(event.id) || event.id <= 0 ||
         typeof event.created_at !== 'string' || !Number.isFinite(Date.parse(event.created_at)) ||
         Date.parse(event.created_at) > startedAt)) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid work-start event identity/time`);
    }
    const actor = event.actor?.login || event.user?.login;
    const ownLabel = ['labeled', 'unlabeled'].includes(event.event) &&
      [settings.event, ...settings.managedLabels].includes(event.label?.name);
    const ownComment = event.body?.startsWith(PREFIX) || isReminder(event.body, settings);
    const own = actor === BOT && (ownLabel || ownComment) && isIgnoredBot(event.actor || event.user);
    if (own) {
      const times = ['created_at', 'updated_at', 'edited_at', 'submitted_at']
        .filter(key => event[key] !== undefined && event[key] !== null)
        .map(key => typeof event[key] === 'string' ? Date.parse(event[key]) : NaN);
      if (!times.length || times.some(time => !Number.isFinite(time))) throw new Error('Invalid KP bookkeeping time');
      if (times.some(time => time > startedAt)) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: future KP bookkeeping time`);
      }
      const timestamp = Math.max(...times);
      excludedActivity = true;
      bookkeepingAt = Math.max(bookkeepingAt, timestamp);
      if (timestamp > Date.parse(clock.observedAt || clock.activityAt)) metadataObscured = true;
      if (ownLabel && event.label.name === settings.event) membershipWrite = true;
      continue;
    }
    if ((event.event || event.user || event.body !== undefined) &&
        isIgnoredBot(event.actor || event.user)) {
      const times = ['created_at', 'updated_at', 'edited_at', 'submitted_at']
        .filter(key => event[key] !== undefined && event[key] !== null)
        .map(key => typeof event[key] === 'string' ? Date.parse(event[key]) : NaN);
      if (!times.length || times.some(time => !Number.isFinite(time) || time > startedAt)) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid bot activity time`);
      }
      const timestamp = Math.max(...times);
      bookkeepingAt = Math.max(bookkeepingAt, timestamp);
      excludedActivity = true;
      // Deleted bot reports need not leave an independently timed deletion event.
      metadataObscured = true;
      continue;
    }
    if (['mentioned', 'subscribed', 'unsubscribed', 'copilot_work_started'].includes(event.event)) {
      const timestamp = typeof event.created_at === 'string' ? Date.parse(event.created_at) : NaN;
      if (!Number.isFinite(timestamp) || timestamp > startedAt) {
        throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid excluded notification time`);
      }
      excludedActivity = true;
      if (timestamp > Date.parse(clock.observedAt || clock.activityAt)) metadataObscured = true;
      continue;
    }
    if (event.event && !ACTIVITY_EVENTS.has(event.event)) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: unsupported timeline event ${event.event}`);
    }
    const time = event.updated_at || event.created_at || event.submitted_at;
    if (!time) throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback time is missing`);
    const timestamp = Date.parse(time);
    if (!Number.isFinite(timestamp) || timestamp > startedAt) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: invalid or future feedback time`);
    }
    meaningfulAt = Math.max(meaningfulAt, timestamp);
    if (timestamp >= since && timestamp > Date.parse(latest)) latest = time;
  }
  if (!comment && excludedActivity && meaningfulAt < Date.parse(pr.updated_at)) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: no trusted baseline before excluded bookkeeping`);
  }
  // Recognize legacy hashes only when the current metadata can reproduce them.
  const legacy = fingerprint(pr, settings.managedLabels) === clock.fingerprint ||
    (membershipWrite && fingerprint({...pr, labels: pr.labels.some(label => label.name === settings.event)
      ? pr.labels.filter(label => label.name !== settings.event)
      : [...pr.labels, {name: settings.event}]}, settings.managedLabels) === clock.fingerprint);
  if (hash !== clock.fingerprint && !legacy) {
    const updatedAt = Date.parse(pr.updated_at);
    const timedBodyOnlyChange = clock.nonBodyFingerprint === nonBodyFingerprint && bodyEditedAt !== null;
    if (timedBodyOnlyChange && Date.parse(bodyEditedAt) > Date.parse(latest)) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: changed body edit predates the review overlap`);
    }
    if (!Number.isFinite(updatedAt) || updatedAt > startedAt ||
        (!timedBodyOnlyChange && updatedAt > Date.parse(latest) &&
          (metadataObscured || bookkeepingAt >= updatedAt))) {
      throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: metadata changed but its time is obscured by KP bookkeeping`);
    }
    if (!timedBodyOnlyChange && updatedAt > Date.parse(latest)) latest = pr.updated_at;
  }
  if (meaningfulAt > Date.parse(latest)) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: human activity outside the review overlap is newer than the accepted baseline`);
  }
  return {activityAt: latest, fingerprint: hash, nonBodyFingerprint, commentIds, feedbackPolicy: FEEDBACK_POLICY,
    confirmedDeletedReviewIds: [...deletedReviews].sort((left, right) => left - right),
    lastReviewedAt: new Date(startedAt).toISOString(),
    [FEEDBACK]: JSON.stringify([feedback(comments, settings), feedback(reviews, settings),
      summaries.filter(item => !isIgnoredBot(item.user)), deletedWrappers])};
}

function feedback(entries, settings) {
  return entries.filter(item => !isIgnoredBot(item.user))
    .map(item => [item.id, item.body, item.created_at, item.updated_at])
    .sort((left, right) => left[0] - right[0]);
}

function reportUncertainty(error, core) {
  if (!(error instanceof UncertainActivity)) throw error;
  core.info(`${error.message}; skipped without advancing the clock/checkpoint or authorizing a reminder.`);
}

async function review(github, repo, core, pr, comment, comments, settings, now,
  startedAt = typeof now === 'function' ? now() : now) {
  try {
    return await readReview(github, repo, core, pr, comment, comments, settings, now, startedAt);
  } catch (error) {
    reportUncertainty(error, core);
    return null;
  }
}

async function readReview(github, repo, core, pr, comment, comments, settings, now, startedAt) {
  const clock = await activity(github, repo, pr, comment, comments, settings, now);
  const {data: latest} = await github.rest.pulls.get({...repo, pull_number: pr.number});
  validateFeedbackCounts(latest);
  const finalComments = await github.paginate(github.rest.issues.listComments, {
    ...repo, issue_number: pr.number, per_page: 100
  });
  const selected = selectClock(finalComments, core, pr.number);
  if (selected?.id !== comment?.id || selected?.body !== comment?.body ||
      latest.state !== pr.state || latest.updated_at !== pr.updated_at ||
      latest.comments !== pr.comments || latest.review_comments !== pr.review_comments ||
      fingerprint(latest, settings.managedLabels, settings.event) !==
        fingerprint(pr, settings.managedLabels, settings.event) ||
      JSON.stringify(latest.labels.map(label => label.name).sort()) !==
        JSON.stringify(pr.labels.map(label => label.name).sort())) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: PR or clock changed during review`);
  }
  const seed = {...clock, observedAt: pr.updated_at,
    lastReviewedAt: comment && readClock(comment).lastReviewedAt};
  const confirmed = await activity(github, repo, latest,
    {...comment, body: clockBody(seed)}, finalComments, settings, now);
  if (confirmed.activityAt !== clock.activityAt || confirmed[FEEDBACK] !== clock[FEEDBACK] ||
      confirmed.nonBodyFingerprint !== clock.nonBodyFingerprint ||
      JSON.stringify(confirmed.commentIds) !== JSON.stringify(clock.commentIds) ||
      JSON.stringify(confirmed.confirmedDeletedReviewIds) !== JSON.stringify(clock.confirmedDeletedReviewIds)) {
    throw new UncertainActivity(`Uncertain KP activity on #${pr.number}: feedback changed during review`);
  }
  return {...clock, lastReviewedAt: new Date(startedAt).toISOString()};
}

function validateFeedbackCounts(pr) {
  for (const field of ['comments', 'review_comments']) {
    if (!Number.isSafeInteger(pr[field]) || pr[field] < 0) {
      throw new Error(`Invalid PR feedback count ${field} on #${pr.number}: expected a nonnegative safe integer`);
    }
  }
}

function validateCommentIdentities(value) {
  if (!value || typeof value !== 'object' ||
      Object.keys(value).sort().join(',') !== 'issue,review' ||
      !['issue', 'review'].every(kind => Array.isArray(value[kind]) &&
        value[kind].every((id, index, ids) => Number.isSafeInteger(id) && id > 0 &&
          (index === 0 || id > ids[index - 1])))) {
    throw new Error('Invalid persisted KP comment identities');
  }
}

function commentIdentities(comments, reviews, settings) {
  const result = {};
  for (const [kind, entries] of [['issue', comments], ['review', reviews]]) {
    if (!Array.isArray(entries)) throw new Error('Missing paginated KP comments');
    validateCommentIdentities({issue: [], review: entries.map(item => item.id).sort((a, b) => a - b)});
    result[kind] = entries.filter(item => !isIgnoredBot(item.user)).map(item => item.id)
      .sort((left, right) => left - right);
  }
  validateCommentIdentities(result);
  return result;
}

async function initialize({github, context, core, pr, eventLabel, managedLabels, now = Date.now}) {
  const startedAt = typeof now === 'function' ? now() : now;
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: pr.number, per_page: 100
  });
  const selection = selectReviewClock(comments, core, pr.number);
  if (!selection) return 'skipped';
  const {comment: existing} = selection;
  if (!Number.isFinite(Date.parse(pr.updated_at)) ||
      !eventLabel || managedLabels.some(label => !label)) throw new Error('Invalid enrollment clock settings');
  const settings = {event: eventLabel, managedLabels,
    message: process.env.AUTHOR_REMINDER_MESSAGE || DEFAULT_MESSAGE};
  const clock = await review(github, context.repo, core, pr, existing, comments, settings, now, startedAt);
  if (!clock) return 'skipped';
  await saveClock(github, context.repo, core, pr, existing, {...clock, observedAt: pr.updated_at});
  core.info(`Preserved pre-enrollment activity for #${pr.number}.`);
  return 'initialized';
}

function selectClock(comments, core, number) {
  const clocks = comments.filter(item =>
    item.user?.login === BOT && item.body?.startsWith(PREFIX) && isIgnoredBot(item.user));
  const ids = new Set();
  for (const comment of clocks) {
    readClock(comment);
    if (!Number.isSafeInteger(comment.id) || comment.id <= 0 || ids.has(comment.id)) {
      throw new Error(`Invalid KP clock comment identity on #${number}`);
    }
    ids.add(comment.id);
  }
  clocks.sort((left, right) => left.id - right.id);
  if (clocks.length > 1) {
    core.info(`Concurrent KP initialization on #${number}; using oldest clock comment ${clocks[0].id}.`);
  }
  return clocks[0];
}

function selectReviewClock(comments, core, number) {
  try {
    return {comment: selectClock(comments, core, number)};
  } catch (error) {
    reportUncertainty(error, core);
    return null;
  }
}

async function saveClock(github, repo, core, pr, comment, clock) {
  const previous = comment && readClock(comment);
  const unchanged = previous && previous.activityAt === clock.activityAt &&
    previous.fingerprint === clock.fingerprint &&
    previous.nonBodyFingerprint === clock.nonBodyFingerprint &&
    previous.lastReviewedAt === clock.lastReviewedAt &&
    previous.feedbackPolicy === clock.feedbackPolicy &&
    JSON.stringify(previous.confirmedDeletedReviewIds) === JSON.stringify(clock.confirmedDeletedReviewIds) &&
    JSON.stringify(previous.commentIds) === JSON.stringify(clock.commentIds);
  const state = unchanged ? previous : {...previous, ...clock, observedAt: pr.updated_at};
  if (comment && (typeof comment.created_at !== 'string' ||
      !Number.isFinite(Date.parse(comment.created_at)))) {
    throw new Error('Missing or invalid KP clock creation time');
  }
  const body = clockBody(state);
  if (unchanged && comment.body === body) return comment;
  const response = comment
    ? await github.rest.issues.updateComment({...repo, comment_id: comment.id, body})
    : await github.rest.issues.createComment({...repo, issue_number: pr.number, body});
  core.info(`Recorded business-day activity clock for #${pr.number}.`);
  if (!comment) {
    const created = response.data;
    if (!Number.isSafeInteger(created?.id) || created.id <= 0 ||
        typeof created.created_at !== 'string' || !Number.isFinite(Date.parse(created.created_at))) {
      throw new Error('Missing or invalid created KP clock identity/time');
    }
    return created;
  }
  return response.data;
}

function configuration() {
  const settings = {
    event: process.env.EVENT_LABEL,
    due: process.env.REMINDER_DUE_LABEL,
    marker: process.env.AUTHOR_REMINDER_LABEL,
    exempt: process.env.EXEMPT_LABEL,
    message: process.env.AUTHOR_REMINDER_MESSAGE,
    branchPrefix: process.env.ROLLOUT_BRANCH_PREFIX
  };
  settings.managedLabels = [settings.due, settings.marker];
  const days = Number(process.env.INACTIVITY_DAYS);
  if (!Object.values(settings).every(value => value?.length) ||
      !Number.isInteger(days) || days < 0) {
    throw new Error('Invalid KP business clock settings');
  }
  return {settings, days};
}

async function reconcile({github, context, core, now = Date.now}) {
  const {settings, days} = configuration();
  const checkedAt = typeof now === 'function' ? now() : now;
  // Label definitions remain manually managed. Fail before changing any PR.
  await github.rest.issues.getLabel({...context.repo, name: settings.due});
  for await (const page of github.paginate.iterator(github.rest.pulls.list, {
    ...context.repo, state: 'open', per_page: 100
  })) {
    for (const candidate of page.data) {
      if (!candidate.labels.some(label => label.name === settings.event)) continue;
      const startedAt = typeof now === 'function' ? now() : now;
      const {data: pr} = await github.rest.pulls.get({
        ...context.repo, pull_number: candidate.number
      });
      if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) continue;
      const comments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: pr.number, per_page: 100
      });
      const selection = selectReviewClock(comments, core, pr.number);
      if (!selection) continue;
      let {comment} = selection;
      let clock = await review(github, context.repo, core, pr, comment, comments, settings, now, startedAt);
      if (!clock) continue;
      comment = await saveClock(github, context.repo, core, pr, comment, clock);
      const has = label => pr.labels.some(item => item.name === label);
      // Never touch a marker here. Stock stale owns posting and cleanup.
      const due = pr.base.ref.startsWith(settings.branchPrefix) &&
        !pr.draft && !has(settings.exempt) && isDue(clock.activityAt, checkedAt, days) &&
        (has(settings.due) || !has(settings.marker));
      if (due && !has(settings.due)) {
        await github.rest.issues.addLabels({
          ...context.repo, issue_number: pr.number, labels: [settings.due]
        });
      } else if (!due && has(settings.due)) {
        await github.rest.issues.removeLabel({
          ...context.repo, issue_number: pr.number, name: settings.due
        });
      }
    }
  }
}


async function canPost({github, context, core, number, now = Date.now}) {
  const {settings, days} = configuration();
  const checkedAt = typeof now === 'function' ? now() : now;
  const {data: pr} = await github.rest.pulls.get({...context.repo, pull_number: number});
  if (pr.state !== 'open') {
    core.info(`Skipping reminder for closed PR #${number}.`);
    return false;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const selection = selectReviewClock(comments, core, number);
  if (!selection) return false;
  const {comment} = selection;
  if (!comment) throw new Error(`Expected one KP clock before posting on #${number}`);
  const clock = await review(github, context.repo, core, pr, comment, comments, settings, now, checkedAt);
  if (!clock) return false;
  const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: number});
  validateFeedbackCounts(latest);
  const has = label => latest.labels.some(item => item.name === label);
  const stable = latest.updated_at === pr.updated_at &&
    latest.comments === pr.comments && latest.review_comments === pr.review_comments &&
    fingerprint(latest, settings.managedLabels, settings.event) ===
      fingerprint(pr, settings.managedLabels, settings.event);
  if (!stable) {
    core.info(`Skipped reminder for #${number} because activity changed during validation; no bookkeeping written.`);
    return false;
  }
  const due = latest.state === 'open' && !latest.draft &&
    latest.base.ref.startsWith(settings.branchPrefix) &&
    has(settings.event) && has(settings.due) && !has(settings.marker) &&
    !has(settings.exempt) && isDue(clock.activityAt, checkedAt, days);
  if (!due) {
    if (latest.state === 'open' && has(settings.due)) {
      await saveClock(github, context.repo, core, pr, comment, clock);
      await github.rest.issues.removeLabel({
        ...context.repo, issue_number: number, name: settings.due
      });
    }
    core.info(`Skipped reminder for #${number} after fresh activity/eligibility checks.`);
  }
  if (due) {
    const saved = await saveClock(github, context.repo, core, pr, comment, clock);
    if (saved !== comment) {
      const {data: finalPR} = await github.rest.pulls.get({...context.repo, pull_number: number});
      validateFeedbackCounts(finalPR);
      const finalComments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: number, per_page: 100
      });
      const finalSelection = selectReviewClock(finalComments, core, number);
      if (!finalSelection) return false;
      const {comment: selected} = finalSelection;
      if (!selected || selected.id !== saved.id || selected.body !== saved.body) {
        core.info(`Skipped reminder for #${number}: clock changed during bookkeeping.`);
        return false;
      }
      const current = await review(github, context.repo, core, finalPR, selected, finalComments, settings, now);
      if (!current) return false;
      const finalHas = label => finalPR.labels.some(item => item.name === label);
      if (finalPR.state !== 'open' || finalPR.draft || !finalHas(settings.event) ||
          !finalHas(settings.due) || finalHas(settings.marker) || finalHas(settings.exempt) ||
          !finalPR.base.ref.startsWith(settings.branchPrefix) ||
          finalPR.comments !== latest.comments || finalPR.review_comments !== latest.review_comments ||
          current.activityAt !== clock.activityAt || current.fingerprint !== clock.fingerprint ||
          current.nonBodyFingerprint !== clock.nonBodyFingerprint ||
          current[FEEDBACK] !== clock[FEEDBACK] ||
          JSON.stringify(current.commentIds) !== JSON.stringify(clock.commentIds) ||
          JSON.stringify(current.confirmedDeletedReviewIds) !== JSON.stringify(clock.confirmedDeletedReviewIds) ||
          JSON.stringify(feedback(finalComments, settings)) !== JSON.stringify(feedback(comments, settings))) {
        core.info(`Skipped reminder for #${number}: activity or eligibility changed during bookkeeping.`);
        return false;
      }
    }
  }
  return due;
}

function isReminder(body, settings) {
  if (body === settings.message) return true;
  const mention = typeof body === 'string' && body.match(/^@([A-Za-z0-9][A-Za-z0-9_-]*(?:\[bot\])?)\n\n/);
  return Boolean(mention && body.slice(mention[0].length) === settings.message);
}

async function hasActivitySince({github, context, core, number, since, now = Date.now}) {
  const startedAt = typeof now === 'function' ? now() : now;
  if (!Number.isFinite(Date.parse(since))) {
    core.info(`Uncertain KP marker time on #${number}; skipped marker cleanup.`);
    return null;
  }
  const {settings} = configuration();
  const {data: pr} = await github.rest.pulls.get({...context.repo, pull_number: number});
  if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) {
    core.info(`Skipping KP marker cleanup outside current open membership on #${number}.`);
    return null;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const selection = selectReviewClock(comments, core, number);
  if (!selection) return null;
  const {comment} = selection;
  if (!comment) {
    core.info(`Uncertain KP activity on #${number}: no trusted KP clock; skipped marker cleanup.`);
    return null;
  }
  const clock = await review(github, context.repo, core, pr, comment, comments, settings, now, startedAt);
  if (!clock) return null;
  const active = Date.parse(clock.activityAt) >= Date.parse(since);
  if (active) await saveClock(github, context.repo, core, pr, comment, clock);
  return active;
}

module.exports = {isDue, fingerprint, readClock, activity, reconcile, canPost, initialize,
  hasActivitySince, PREFIX};
