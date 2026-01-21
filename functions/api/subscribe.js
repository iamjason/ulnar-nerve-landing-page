export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const formData = await request.formData();
    const email = formData.get('email');

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email required' }),
        { status: 400, headers }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Store in KV with timestamp
    // Key: email address, Value: metadata
    const data = {
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      source: 'ulnar.app',
    };

    await env.SUBSCRIBERS.put(normalizedEmail, JSON.stringify(data));

    // Also maintain a list for easy export
    const listKey = 'subscriber_list';
    const existingList = await env.SUBSCRIBERS.get(listKey);
    const subscribers = existingList ? JSON.parse(existingList) : [];
    
    if (!subscribers.includes(normalizedEmail)) {
      subscribers.push(normalizedEmail);
      await env.SUBSCRIBERS.put(listKey, JSON.stringify(subscribers));
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Subscribed!' }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
