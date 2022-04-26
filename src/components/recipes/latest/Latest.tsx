import styled from '@emotion/styled'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useState } from 'react'
import Secondary from '../../buttons/secondary/Secondary'
import ResipeCard from '../../recipeCard/ResipeCard'

const RecipeGrid = styled.div({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    ['@media only screen and (min-width: 90ch)']: {
        gridTemplateColumns: '1fr',
    },
})
const Wrapper = styled.div({
    display: 'grid',
})

type LatestQuery = {
    allRating: {
        nodes: {
            rating?: {
                avgRating: number
                numRatings: number
            } | null
            parent: {
                id: string
            }
        }[]
    }
    allWpRecept: {
        nodes: {
            id: string
            uri: string
            title: string
            singlePaketAfc: {
                tidFormat: string
                tid: number
                svarighetsgrad: 'Lätt' | 'Medel' | 'Svår'
                kortBeskrivning: string
                images: {
                    localFile: {
                        childrenImageSharp: [
                            {
                                original: {
                                    src: string
                                }
                                fixed: {
                                    src: string
                                }
                            }
                        ]
                    }
                }[]
            }
        }[]
    }
}

const Latest = ({
    show = 6,
    loadMore,
    ...rest
}: { show?: number; loadMore?: boolean } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>) => {
    const data: LatestQuery = useStaticQuery(graphql`
        {
            allRating {
                nodes {
                    id
                    avgRating
                    numRatings
                    parent {
                        id
                    }
                }
            }
            allWpRecept(sort: { fields: [date], order: DESC }) {
                nodes {
                    id
                    uri
                    title
                    singlePaketAfc {
                        tidFormat
                        tid
                        svarighetsgrad
                        kortBeskrivning
                        images {
                            localFile {
                                childrenImageSharp {
                                    original {
                                        src
                                    }
                                    fixed(width: 400, height: 400) {
                                        src
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `)

    data.allWpRecept.nodes = data.allWpRecept.nodes.map(recept => {
        const rating = data.allRating?.nodes?.find(
            rating => rating.parent?.id === recept.id
        )
        return {
            ...recept,
            rating: rating ? rating : null,
        }
    })
    const [amount, setstate] = useState(show)
    const allRecipes = data.allWpRecept.nodes
    const recipies = data.allWpRecept.nodes.slice(0, amount) as [
        ...(LatestQuery['allWpRecept']['nodes'] &
            {
                rating?: {
                    avgRating: number
                    numRatings: number
                } | null
            }[])
    ]
    const onClick = () => {
        setstate(prev => prev + 8)
    }

    return (
        <Wrapper>
            <RecipeGrid {...rest}>
                {recipies.map(recipe => {
                    return (
                        <ResipeCard
                            kortBeskrivning={
                                recipe.singlePaketAfc.kortBeskrivning
                            }
                            variant="vert"
                            svarighetsgrad={
                                recipe.singlePaketAfc.svarighetsgrad
                            }
                            uri={recipe.uri}
                            key={recipe.id}
                            rating={recipe?.rating?.avgRating}
                            id={recipe.id}
                            tid={recipe.singlePaketAfc.tid}
                            tidFormat={recipe.singlePaketAfc.tidFormat}
                            title={recipe.title}
                            url={
                                recipe.singlePaketAfc.images?.[0]?.localFile
                                    .childrenImageSharp?.[0]?.original.src
                            }
                        />
                    )
                })}
            </RecipeGrid>
            {loadMore && amount < allRecipes.length && (
                <Secondary
                    style={{ marginTop: '30px', placeSelf: 'center' }}
                    onClick={onClick}
                >
                    Ladda fler
                </Secondary>
            )}
        </Wrapper>
    )
}

export default Latest
