import "./globals.css"
import { type ReactNode } from "react"
import type { Metadata } from "next"
import { Poppins, Orbitron } from "next/font/google"

const title = "Tableland: MBTiles Demo"
const description = "MBTiles demo using a Tableland FVM Actor"

export const metadata: Metadata = {
  title,
  description,
  keywords: [],
  category: "technology",
  themeColor: "#101e1e",
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-orbitron",
})

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen ${poppins.variable} ${orbitron.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
