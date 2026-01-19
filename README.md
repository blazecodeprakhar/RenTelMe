# RenTelMe

> **Elevating the rental experience.** We provide curated homes with verified neighborhood insights for a seamless transition.

RenTelMe is a modern, premium rental property platform designed to help users find their perfect home with ease. Built with a focus on trust, transparency, and community, it offers comprehensive neighborhood details, verified listings, and a seamless user interface.

![RenTelMe Hero](./public/logo.png)

## 🚀 Features

-   **Premium UI/UX:** A visually stunning, responsive design featuring a Deep Emerald & Champagne luxury color palette.
-   **Advanced Property Search:** Filter properties by type (Family, Student, Commercial, etc.), location, and more.
-   **Verified Listings:** Trustworthy listings with detailed information.
-   **Neighborhood Insights:** Go beyond the house—know about local amenities, shops, and services.
-   **Easy Listing:** Simple process for property owners to list their spaces.
-   **Interactive Contact:** Integrated contact forms and direct support links.
-   **Smooth Navigation:** Seamless transitions and scroll-to-top functionality for a polished feel.

## 🛠️ Tech Stack

This project is built using the following technologies:

-   **Frontend Framework:** [React](https://reactjs.org/) (v18)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Radix UI](https://www.radix-ui.com/) (Primitives), [Lucide React](https://lucide.dev/) (Icons)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
-   **Routing:** [React Router](https://reactrouter.com/)

## 📦 Installation & Setup

Follow these steps to get the project running locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/StartYourCloud/RenTelMe.git
    cd RenTelMe
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:8080` (or the port shown in your terminal).

## 🏗️ Build for Production

To build the application for production:

```bash
npm run build
```

This will generate the optimized files in the `dist` directory.

## 📁 Project Structure

```
RenTelMe/
├── public/              # Static assets (logo, favicon)
├── src/
│   ├── assets/          # Project images and assets
│   ├── components/      # Reusable UI components
│   │   ├── cards/       # Property, Testimonial, Feature cards
│   │   ├── layout/      # Header, Footer, Layout wrappers
│   │   └── ui/          # Generic UI elements (Buttons, Inputs, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages (Index, About, Contact, etc.)
│   ├── App.tsx          # Main Application component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles & Tailwind directives
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**RenTelMe** - Crafted for Excellence.
