import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
      const response = await axios.post(
        "https://api.management.parse25proje.link/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.data.token;
      if (token) {
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
