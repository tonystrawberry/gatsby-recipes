import React from "react"
import { Link, graphql } from "gatsby"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"

import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { BsClockHistory, BsClock, BsPeople } from "react-icons/bs"
import Layout from "../components/Layout"
import slugify from "slugify"
import SEO from "../components/SEO"

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <b className="font-bold">{text}</b>,
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data
      return (
        <a href={uri} className="underline">
          {children}
        </a>
      )
    },
    [BLOCKS.HEADING_2]: (node, children) => {
      return <h2>{children}</h2>
    },
  },
}

export default function RecipeTemplate({ data }) {
  const {
    title,
    cookTime,
    content,
    prepTime,
    servings,
    description: { raw },
    image,
  } = data.contentfulRecipe

  const { tags, instructions, ingredients, tools } = content

  console.log("IMAGE", image)
  const pathToImage = getImage(image)

  return (
    <Layout>
      <SEO title={title} />
      <main className="page">
        <div className="recipe-page">
          <section className="recipe-hero">
            <GatsbyImage
              image={pathToImage}
              alt={title}
              className="about-img"
            />
            <article className="recipe-info">
              <h2>{title}</h2>
              <div>{raw ? renderRichText({ raw }, options) : ""}</div>
              {/* icons */}
              <div className="recipe-icons">
                <article>
                  <BsClock />
                  <h5>prep time</h5>
                  <p>{prepTime} min.</p>
                </article>
                <article>
                  <BsClockHistory />
                  <h5>cook time</h5>
                  <p>{cookTime} min.</p>
                </article>
                <article>
                  <BsPeople />
                  <h5>serving</h5>
                  <p>{servings} </p>
                </article>
              </div>
              {/* tags */}
              <p className="recipe-tags">
                Tags :
                {tags.map((tag, index) => {
                  const slug = slugify(tag, { lower: true })

                  return (
                    <Link to={`/tags/${slug}`} key={index}>
                      {tag}
                    </Link>
                  )
                })}
              </p>
            </article>
          </section>

          <section className="recipe-content">
            <article>
              <h4>instructions</h4>
              {instructions.map((item, index) => {
                return (
                  <div key={index} className="single-instruction">
                    <header>
                      <p>step {index + 1}</p>
                      <div></div>
                    </header>
                    <p>{item}</p>
                  </div>
                )
              })}
            </article>
            <article className="second-column">
              <div>
                <h4>ingredients</h4>
                {ingredients.map((item, index) => {
                  return (
                    <p key={index} className="single-ingredient">
                      {item}
                    </p>
                  )
                })}
              </div>
              <div>
                <h4>tools</h4>
                {tools.map((item, index) => {
                  return (
                    <p key={index} className="single-tool">
                      {item}
                    </p>
                  )
                })}
              </div>
            </article>
          </section>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query getSingleRecipe($title: String) {
    contentfulRecipe(title: { eq: $title }) {
      title
      cookTime
      content {
        ingredients
        instructions
        tags
        tools
      }
      description {
        raw
      }
      prepTime
      servings
      image {
        gatsbyImageData(layout: CONSTRAINED, placeholder: TRACED_SVG)
      }
    }
  }
`
