const API_URL = "http://localhost:3000";


function jsonFetch( input: string | URL | globalThis.Request, init?: RequestInit & {payload: Object},) {
    return fetch(input, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers
        },
        body: init?.payload ? JSON.stringify(init.payload) : init?.body
    })

}
export async function login(email: string, password: string) {
  const response = await jsonFetch(API_URL + "/auth/login", {
    method: "POST",
    payload: {email, password}
  });

  const data = await response.json();

  if (response.status != 201) {
    throw Error(data.message.join(", "))
  }

  return data

}

export function authApi(token: string) {
  return {
    async me(token: string) {
      const response = await fetch(API_URL + "/auth/login", {
        headers: {
          Auth: "bearer: " + token,
          'Content-Type': 'application/json'
        },
      });

      return await response.json();
    },
  };
}
