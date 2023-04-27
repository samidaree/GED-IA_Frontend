
import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';

/**
 * A React component representing the About page.
 * @returns {JSX.Element} - The JSX element representing the component.
 */
const About = () => {
    return (
        <div>
            <Logo />
            <Navigation />
            <p>La GED IA est une application web de gestion de document automatique conçue pour faciliter la lecture et la gestion des fichiers PDF avec table de matières. Elle permet de générer un résumé des articles et récupérer les mots clés avant de les enregistrer dans une base de données.
                Il est également possible de lire le fichier PDF dans un nouvel onglet ainsi que de saisir des prompts personnalisés qui détaillent les résumés et mots clés attendus.
            </p>
        </div>
    );
};

export default About;