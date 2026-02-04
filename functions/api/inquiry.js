async function sendEmailNotification(env, data) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ulnar Notifications <notifications@mail.ulnar.app>',
        to: 'hello@ulnar.app',
        subject: `New Inquiry from ${data.company}`,
        text: `New inquiry received:

Name: ${data.name}
Company: ${data.company}
Email: ${data.email}
Category: ${data.category || 'Not specified'}
Message: ${data.message}

Submitted: ${data.submittedAt}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
    }
  } catch (error) {
    console.error('Email notification error:', error);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const formData = await request.formData();

    const name = formData.get('name')?.trim();
    const company = formData.get('company')?.trim();
    const email = formData.get('email')?.toLowerCase().trim();
    const category = formData.get('category')?.trim() || '';
    const message = formData.get('message')?.trim();

    // Validate required fields
    if (!name || !company || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, company, email, and message are required' }),
        { status: 400, headers }
      );
    }

    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email required' }),
        { status: 400, headers }
      );
    }

    // Create unique key with timestamp
    const timestamp = new Date().toISOString();
    const key = `${timestamp}_${email}`;

    const data = {
      name,
      company,
      email,
      category,
      message,
      submittedAt: timestamp,
      source: 'ulnar.app',
    };

    await env.INQUIRIES.put(key, JSON.stringify(data));

    // Maintain a list of inquiry keys for easy export
    const listKey = 'inquiry_list';
    const existingList = await env.INQUIRIES.get(listKey);
    const inquiries = existingList ? JSON.parse(existingList) : [];

    inquiries.push(key);
    await env.INQUIRIES.put(listKey, JSON.stringify(inquiries));

    // Send email notification (fire-and-forget, doesn't block response)
    context.waitUntil(sendEmailNotification(env, data));

    return new Response(
      JSON.stringify({ success: true, message: 'Inquiry sent!' }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Inquiry error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
